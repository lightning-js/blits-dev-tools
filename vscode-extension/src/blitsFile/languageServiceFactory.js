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

const workspaceHandler = require('../core/workspaceHandler')
const originalLanguageServiceModule = require('./languageService')
const vscode = require('vscode')

const projectLanguageServices = new Map()
const projectsWithOpenFiles = new Set()

function log(message) {
  console.log(`[LanguageServiceFactory] ${message}`)
}

function updateProjectsWithOpenFiles() {
  projectsWithOpenFiles.clear()

  // Get all open text documents
  const openDocuments = vscode.workspace.textDocuments

  // Check each open document to see which project it belongs to
  for (const document of openDocuments) {
    if (document.uri.scheme !== 'file') continue

    // Check if this file is part of a Blits project
    const projectPath = workspaceHandler.getProjectForFile(document.uri.fsPath)
    if (projectPath) {
      projectsWithOpenFiles.add(projectPath)
    }
  }

  log(`Active projects with open files: ${projectsWithOpenFiles.size}`)

  // Clean up language services for projects with no open files
  for (const [projectPath, service] of projectLanguageServices.entries()) {
    if (!projectsWithOpenFiles.has(projectPath)) {
      log(`Disposing language service for inactive project: ${projectPath}`)
      service.disposeLanguageServices()
      projectLanguageServices.delete(projectPath)
    }
  }
}

function getLanguageServiceForProject(projectPath) {
  if (!projectsWithOpenFiles.has(projectPath)) {
    return null
  }

  if (!projectLanguageServices.has(projectPath)) {
    log(`Creating new language service for project: ${projectPath}`)

    // Create a new language service instance for this project
    const languageServiceInstance = originalLanguageServiceModule.getLanguageServiceInstance()
    languageServiceInstance.projectPath = projectPath

    projectLanguageServices.set(projectPath, languageServiceInstance)
  }

  return projectLanguageServices.get(projectPath)
}

function getLanguageServiceForFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return null
  }

  if (filePath.includes('node_modules') || filePath.includes('/.git/') || filePath.includes('/.vscode/')) {
    return null
  }

  const projectPath = workspaceHandler.getProjectForFile(filePath)
  if (!projectPath) {
    return null
  }

  if (!projectsWithOpenFiles.has(projectPath)) {
    return null
  }

  return getLanguageServiceForProject(projectPath)
}

function getLanguageServiceInstance() {
  // Initialize the set of projects with open files
  updateProjectsWithOpenFiles()

  // Set up event listeners for document changes
  if (!getLanguageServiceInstance.initialized) {
    vscode.workspace.onDidOpenTextDocument(() => {
      updateProjectsWithOpenFiles()
    })

    vscode.workspace.onDidCloseTextDocument(() => {
      updateProjectsWithOpenFiles()
    })

    getLanguageServiceInstance.initialized = true
  }

  return {
    getLanguageService: (fileName) => {
      // Only process files from projects with open documents
      const service = getLanguageServiceForFile(fileName)
      if (service) {
        return service.getLanguageService(fileName)
      }

      // For other cases, just return a minimal service
      return {
        getCompletionsAtPosition: () => null,
        getQuickInfoAtPosition: () => null,
        getDefinitionAtPosition: () => null,
        getSignatureHelpItems: () => null,
        getSemanticDiagnostics: () => [],
        getSyntacticDiagnostics: () => [],
        dispose: () => {},
      }
    },

    disposeLanguageServices: () => {
      // Dispose all project-specific services
      for (const [projectPath, service] of projectLanguageServices.entries()) {
        log(`Disposing language service for project: ${projectPath}`)
        service.disposeLanguageServices()
      }
      projectLanguageServices.clear()
    },
  }
}

// Flag to track initialization of event listeners
getLanguageServiceInstance.initialized = false

module.exports = {
  getLanguageServiceForFile,
  getLanguageServiceForProject,
  getLanguageServiceInstance,
  updateProjectsWithOpenFiles,
}
