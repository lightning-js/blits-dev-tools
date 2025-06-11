/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const vscode = require('vscode')
const fs = require('fs/promises')
const { existsSync, readFileSync } = require('fs')
const path = require('path')
const debounce = require('lodash/debounce')

let isBlits = true
let packageJsonWatcher = null

// Project registry functionality
let discoveryInitiated = false
let discoveryPromise = null
const blitsProjects = new Map() // Maps project path to project metadata
const filePathCache = new Map() // Maps file paths to project paths
let projectWatcher = null

/**
 * When prettier plugin is available, we will remove the format template on save functionality to avoid conflicts eventually.
 * Until then, we should check if the prettier plugin is available and skip the format template on save functionality.
 */
function checkForPrettierPlugin(pkg) {
  return !!(
    (pkg.devDependencies && pkg.devDependencies['@lightningjs/prettier-plugin-blits']) ||
    (pkg.dependencies && pkg.dependencies['@lightningjs/prettier-plugin-blits'])
  )
}

// Find all Blits projects in the workspace by scanning for package.json files
async function discoverProjects() {
  if (discoveryPromise) {
    return discoveryPromise
  }

  discoveryPromise = (async () => {
    console.log('Starting discovery of Blits projects in workspace')

    if (!vscode.workspace.workspaceFolders) {
      console.log('No workspace folders available')
      return blitsProjects
    }

    try {
      // First check if workspace roots contain Blits projects
      let rootProjectFound = false

      for (const folder of vscode.workspace.workspaceFolders) {
        const rootPackageJsonPath = path.join(folder.uri.fsPath, 'package.json')

        try {
          // Check if package.json exists in the root folder
          if (existsSync(rootPackageJsonPath)) {
            const content = readFileSync(rootPackageJsonPath, 'utf8')
            const pkg = JSON.parse(content)

            // If this root folder is a Blits project, register it and skip deeper scanning
            if (pkg.dependencies && pkg.dependencies['@lightningjs/blits']) {
              console.log(`Found Blits project at workspace root: ${folder.uri.fsPath}`)

              blitsProjects.set(folder.uri.fsPath, {
                name: pkg.name || path.basename(folder.uri.fsPath),
                path: folder.uri.fsPath,
                hasPrettierPlugin: checkForPrettierPlugin(pkg),
              })
              rootProjectFound = true
            }
          }
        } catch (err) {
          console.log(`Error checking root package.json at ${rootPackageJsonPath}: ${err.message}`)
        }
      }

      // If we found Blits projects at the root level, skip deeper scanning
      if (!rootProjectFound) {
        // Scan for all package.json files in the workspace with increased limit
        const packageJsonFiles = await vscode.workspace.findFiles('**/package.json', '**/node_modules/**', 1000)
        console.log(`Found ${packageJsonFiles.length} package.json files to scan`)

        // Process each package.json file
        for (const fileUri of packageJsonFiles) {
          try {
            const content = await fs.readFile(fileUri.fsPath, 'utf8')
            const pkg = JSON.parse(content)

            // Check for direct @lightningjs/blits dependency
            if (pkg.dependencies && pkg.dependencies['@lightningjs/blits']) {
              const projectDir = path.dirname(fileUri.fsPath)

              blitsProjects.set(projectDir, {
                name: pkg.name || path.basename(projectDir),
                path: projectDir,
                hasPrettierPlugin: checkForPrettierPlugin(pkg),
              })
            }
          } catch (err) {
            // Skip invalid package.json files
            console.log(`Error processing ${fileUri.fsPath}: ${err.message}`)
          }
        }
      } else {
        console.log('Skipped deep scanning since Blits project(s) found at workspace root level')
      }

      // Setup a file watcher for package.json changes in the workspace
      setupProjectWatcher()

      // Mark discovery as completed
      discoveryInitiated = true
      console.log(`Discovery complete. Found ${blitsProjects.size} Blits projects`)

      return blitsProjects
    } catch (error) {
      console.log(`Error during project discovery: ${error.message}`)
      discoveryInitiated = true
      return blitsProjects
    }
  })()

  return discoveryPromise
}

async function ensureDiscoveryStarted() {
  if (!discoveryInitiated) {
    await discoverProjects()
  }
}

// watcher for package.json changes in the workspace
function setupProjectWatcher() {
  // Clean up any existing watcher
  if (projectWatcher) {
    projectWatcher.dispose()
  }

  // Watch for package.json changes across the workspace
  projectWatcher = vscode.workspace.createFileSystemWatcher('**/package.json')
  projectWatcher.onDidChange((uri) => debounce(() => handlePackageJsonChange(uri), 500)())
  projectWatcher.onDidCreate((uri) => debounce(() => handlePackageJsonChange(uri), 500)())
  projectWatcher.onDidDelete((uri) => debounce(() => handlePackageJsonChange(uri), 500)())
}

async function handlePackageJsonChange(uri) {
  const projectDir = path.dirname(uri.fsPath)
  const wasProject = blitsProjects.has(projectDir)

  try {
    const content = await fs.readFile(uri.fsPath, 'utf8')
    const pkg = JSON.parse(content)

    // Check if it's a Blits project now
    const isBlitsProject = pkg.dependencies && pkg.dependencies['@lightningjs/blits']

    if (isBlitsProject && !wasProject) {
      // New Blits project
      console.log(`Adding new Blits project at ${projectDir}`)

      blitsProjects.set(projectDir, {
        name: pkg.name || path.basename(projectDir),
        path: projectDir,
        hasPrettierPlugin: checkForPrettierPlugin(pkg),
      })
      console.log(
        `Blits project at ${projectDir} has prettier-plugin-blits: ${blitsProjects.get(projectDir).hasPrettierPlugin}`
      )
      clearFilePathCache() // Clear the file path cache to ensure reevaluation
    } else if (!isBlitsProject && wasProject) {
      // Removed Blits dependency
      console.log(`Removing Blits project at ${projectDir}`)
      blitsProjects.delete(projectDir)
      clearFilePathCache() // Clear the file path cache to ensure reevaluation
    }
  } catch (err) {
    // If we can't read/parse the file and it was a Blits project, remove it
    if (wasProject) {
      console.log(`Error reading ${uri.fsPath}, removing project: ${err.message}`)
      blitsProjects.delete(projectDir)
      clearFilePathCache()
    }
  }
}

function clearFilePathCache() {
  filePathCache.clear()
}

function getProjectForFile(filePath) {
  const normalizedPath = path.normalize(filePath)

  // Fast path: check cache
  if (filePathCache.has(normalizedPath)) {
    const result = filePathCache.get(normalizedPath)
    return result
  }

  // Make sure discovery has been initiated
  if (!discoveryInitiated) {
    // This is intentionally not awaited - we'll use what we have so far to avoid blocking
    ensureDiscoveryStarted()
  }

  let result = null

  // Sort project paths by length (descending) to match the most specific project first
  // This handles nested project scenarios correctly
  const sortedProjectPaths = Array.from(blitsProjects.keys()).sort((a, b) => b.length - a.length)

  for (const projectPath of sortedProjectPaths) {
    if (normalizedPath.startsWith(projectPath + path.sep) || normalizedPath === projectPath) {
      result = projectPath
      break
    }
  }

  // Cache result for future queries if discovery was initiated
  if (discoveryInitiated) {
    filePathCache.set(normalizedPath, result)
  }
  return result
}

function getBlitsProjects() {
  return blitsProjects
}

function dispose() {
  if (packageJsonWatcher) {
    packageJsonWatcher.dispose()
  }
  if (projectWatcher) {
    projectWatcher.dispose()
  }
}

function isBlitsApp(filePath) {
  // console.log(`isBlitsApp called with filePath: ${filePath || 'undefined'}, type: ${typeof filePath}`)

  // Fix for empty string paths
  if (filePath === '') {
    // console.log('Empty string filePath detected, treating as undefined')
    filePath = undefined
  }

  // Handle URI objects directly
  if (filePath && typeof filePath === 'object' && filePath.scheme) {
    // Skip non-file URIs (like git, scm, etc)
    if (filePath.scheme !== 'file') {
      // console.log(`Skipping non-file URI scheme: ${filePath.scheme}`)
      return false
    }
    filePath = filePath.fsPath
  }

  // Only process regular file paths that start with expected OS path format
  if (filePath && typeof filePath === 'string') {
    // Skip special URI schemes that might come through as strings
    if (filePath.startsWith('git:') || filePath.startsWith('scm:')) {
      console.log(`Skipping special URI path: ${filePath}`)
      return false
    }

    try {
      const result = getProjectForFile(filePath) !== null
      console.log(`isBlitsApp result for ${filePath}: ${result}`)
      return result
    } catch (error) {
      console.error(`[WorkspaceHandler] Error checking if file is in Blits project: ${error.message}`)
      // Fall back to legacy behavior on error
      return isBlits
    }
  }

  // Old behavior: check if workspace root is a Blits project
  return isBlits
}

function getFrameworkAttributes(filePath) {
  // Get the relevant project directory
  let projectDir = null

  if (filePath) {
    projectDir = getProjectForFile(filePath)
    if (!projectDir) {
      return false
    }
  } else if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    // fallback: use the first workspace folder
    projectDir = vscode.workspace.workspaceFolders[0].uri.fsPath
  } else {
    return false
  }

  // Look for template attributes in the project's blits dependency
  const attributesPath = path.join(
    projectDir,
    'node_modules',
    '@lightningjs',
    'blits',
    'vscode',
    'data',
    'template-attributes.json'
  )

  try {
    // Use synchronous file read for framework attributes as it's needed immediately
    const data = existsSync(attributesPath) ? readFileSync(attributesPath, 'utf8') : null
    return data ? JSON.parse(data) : false
  } catch (error) {
    console.log(`Error reading framework attributes: ${error.message}`)
    return false
  }
}

async function isFileInBlitsProjectAsync(filePath) {
  await ensureDiscoveryStarted()
  return getProjectForFile(filePath) !== null
}

function hasPrettierPlugin(filePath) {
  const projectPath = getProjectForFile(filePath)
  if (!projectPath) return false

  const projectInfo = blitsProjects.get(projectPath)
  return projectInfo && projectInfo.hasPrettierPlugin === true
}

module.exports = {
  dispose,
  isBlitsApp,
  getFrameworkAttributes,
  getProjectForFile,
  discoverProjects,
  ensureDiscoveryStarted,
  getBlitsProjects,
  clearFilePathCache,
  isFileInBlitsProjectAsync,
  hasPrettierPlugin,
}
