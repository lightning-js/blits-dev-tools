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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getCompletions(uri, position) {
  return vscode.commands.executeCommand('vscode.executeCompletionItemProvider', uri, position)
}

async function getHovers(uri, position) {
  return vscode.commands.executeCommand('vscode.executeHoverProvider', uri, position)
}

async function getSignatureHelp(uri, position, triggerCharacter) {
  return vscode.commands.executeCommand('vscode.executeSignatureHelpProvider', uri, position, triggerCharacter)
}

async function waitForCondition(fn, predicate, options = {}) {
  const { timeout = 5000, interval = 100, message = 'Condition not met within timeout' } = options

  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const result = await fn()
    if (predicate(result)) {
      return result
    }
    await sleep(interval)
  }

  throw new Error(`${message} (timeout: ${timeout}ms)`)
}

async function waitForDiagnostics(uri, options = {}) {
  const { timeout = 5000, minCount = 1 } = options

  return waitForCondition(
    () => vscode.languages.getDiagnostics(uri),
    (diagnostics) => diagnostics.length >= minCount,
    {
      timeout,
      message: `Expected at least ${minCount} diagnostic(s)`,
    }
  )
}

async function waitForHover(uri, position, options = {}) {
  const { timeout = 5000 } = options

  return waitForCondition(
    () => getHovers(uri, position),
    (hovers) => Array.isArray(hovers) && hovers.length > 0,
    {
      timeout,
      message: 'Expected hover results within timeout',
    }
  )
}

async function waitForNoDiagnostics(uri, options = {}) {
  const { timeout = 5000 } = options

  return waitForCondition(
    () => vscode.languages.getDiagnostics(uri),
    (diagnostics) => diagnostics.length === 0,
    {
      timeout,
      message: 'Expected diagnostics to be cleared',
    }
  )
}

async function activateExtension() {
  const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
  if (!extension) {
    throw new Error('Extension not found')
  }

  if (!extension.isActive) {
    await extension.activate()
    // discoverProjects() is fired without await during activation — give it time to
    // complete before tests start making isBlitsApp() checks
    await sleep(500)
  }

  return extension
}

// Returns null if not found; callers should assert.ok(position, ...)
function findPosition(document, searchText, offset = 0) {
  const text = document.getText()
  const index = text.indexOf(searchText)

  if (index === -1) {
    return null
  }

  return document.positionAt(index + offset)
}

function findAllPositions(document, searchText) {
  const text = document.getText()
  const positions = []
  let index = text.indexOf(searchText)

  while (index !== -1) {
    positions.push(document.positionAt(index))
    index = text.indexOf(searchText, index + 1)
  }

  return positions
}

function setCursorPosition(editor, position) {
  editor.selection = new vscode.Selection(position, position)
}

function getCompletionLabels(completions) {
  if (!completions) return []
  return completions.items.map((item) => (typeof item.label === 'string' ? item.label : item.label.label || ''))
}

module.exports = {
  sleep,
  getCompletions,
  getHovers,
  getSignatureHelp,
  waitForCondition,
  waitForDiagnostics,
  waitForNoDiagnostics,
  waitForHover,
  activateExtension,
  findPosition,
  findAllPositions,
  setCursorPosition,
  getCompletionLabels,
}
