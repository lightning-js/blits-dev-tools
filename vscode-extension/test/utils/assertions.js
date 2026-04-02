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

const assert = require('assert')
const vscode = require('vscode')

function assertHasCompletion(completions, label, message) {
  assert.ok(completions, message || 'Expected completions to be defined')
  assert.ok(completions.items.length > 0, message || 'Expected at least one completion item')

  const found = completions.items.some((item) => {
    const itemLabel = typeof item.label === 'string' ? item.label : item.label.label || ''
    return itemLabel.includes(label)
  })

  assert.ok(
    found,
    message ||
      `Expected completion list to contain "${label}". Found: ${completions.items
        .map((i) => (typeof i.label === 'string' ? i.label : i.label.label))
        .join(', ')}`
  )
}

function assertHasCompletionExact(completions, label, message) {
  assert.ok(completions, message || 'Expected completions to be defined')
  assert.ok(completions.items.length > 0, message || 'Expected at least one completion item')

  const found = completions.items.some((item) => {
    const itemLabel = typeof item.label === 'string' ? item.label : item.label.label || ''
    return itemLabel === label
  })

  assert.ok(
    found,
    message ||
      `Expected completion list to contain exact match "${label}". Found: ${completions.items
        .map((i) => (typeof i.label === 'string' ? i.label : i.label.label))
        .join(', ')}`
  )
}

function assertHasCompletionsExact(completions, labels, message) {
  assert.ok(completions, message || 'Expected completions to be defined')
  for (const label of labels) {
    assertHasCompletionExact(completions, label, message)
  }
}

function assertNotHasCompletionExact(completions, label, message) {
  if (!completions || completions.items.length === 0) {
    return
  }

  const found = completions.items.some((item) => {
    const itemLabel = typeof item.label === 'string' ? item.label : item.label.label || ''
    return itemLabel === label
  })

  assert.ok(!found, message || `Expected completion list to NOT contain exact match "${label}"`)
}

function assertNotHasCompletion(completions, label, message) {
  if (!completions || completions.items.length === 0) {
    return
  }

  const found = completions.items.some((item) => {
    const itemLabel = typeof item.label === 'string' ? item.label : item.label.label || ''
    return itemLabel.includes(label)
  })

  assert.ok(!found, message || `Expected completion list to NOT contain "${label}"`)
}

function assertHasCompletions(completions, labels, message) {
  assert.ok(completions, message || 'Expected completions to be defined')

  for (const label of labels) {
    assertHasCompletion(completions, label, message)
  }
}

function assertHasDiagnostic(diagnostics, messagePattern, assertMessage) {
  assert.ok(Array.isArray(diagnostics), 'Expected diagnostics to be an array')

  const matcher =
    typeof messagePattern === 'string'
      ? (d) => d.message.includes(messagePattern)
      : (d) => messagePattern.test(d.message)

  const found = diagnostics.find(matcher)

  assert.ok(
    found,
    assertMessage ||
      `Expected diagnostic matching "${messagePattern}". Got: ${
        diagnostics.map((d) => d.message).join(', ') || '(none)'
      }`
  )

  return found
}

function assertNotHasDiagnostic(diagnostics, messagePattern, assertMessage) {
  assert.ok(Array.isArray(diagnostics), 'Expected diagnostics to be an array')

  const matcher =
    typeof messagePattern === 'string'
      ? (d) => d.message.includes(messagePattern)
      : (d) => messagePattern.test(d.message)

  const found = diagnostics.some(matcher)

  assert.ok(!found, assertMessage || `Expected NO diagnostic matching "${messagePattern}"`)
}

function assertDiagnosticCount(diagnostics, count, message) {
  assert.strictEqual(
    diagnostics.length,
    count,
    message ||
      `Expected exactly ${count} diagnostic(s), got ${diagnostics.length}: ${diagnostics
        .map((d) => d.message)
        .join(', ')}`
  )
}

function assertDiagnosticSeverity(diagnostic, severity, message) {
  assert.strictEqual(
    diagnostic.severity,
    severity,
    message ||
      `Expected severity ${vscode.DiagnosticSeverity[severity]}, got ${vscode.DiagnosticSeverity[diagnostic.severity]}`
  )
}

function assertHoverContains(hovers, expectedText, message) {
  assert.ok(hovers && hovers.length > 0, message || 'Expected at least one hover result')

  const contents = hovers.flatMap((h) => h.contents)

  const matcher =
    typeof expectedText === 'string'
      ? (c) => (typeof c === 'string' ? c.includes(expectedText) : c.value.includes(expectedText))
      : (c) => (typeof c === 'string' ? expectedText.test(c) : expectedText.test(c.value))

  const found = contents.some(matcher)

  assert.ok(found, message || `Expected hover to contain "${expectedText}"`)
}

function assertLanguageId(document, expectedLanguageId, message) {
  assert.strictEqual(
    document.languageId,
    expectedLanguageId,
    message || `Expected language ID "${expectedLanguageId}", got "${document.languageId}"`
  )
}

function assertExtensionActive(extension, message) {
  assert.ok(extension.isActive, message || `Extension ${extension.id} should be active`)
}

async function assertCommandRegistered(commandId, message) {
  const commands = await vscode.commands.getCommands()
  assert.ok(commands.includes(commandId), message || `Expected command "${commandId}" to be registered`)
}

module.exports = {
  assertHasCompletion,
  assertHasCompletionExact,
  assertNotHasCompletion,
  assertNotHasCompletionExact,
  assertHasCompletions,
  assertHasCompletionsExact,
  assertHasDiagnostic,
  assertNotHasDiagnostic,
  assertDiagnosticCount,
  assertDiagnosticSeverity,
  assertHoverContains,
  assertLanguageId,
  assertExtensionActive,
  assertCommandRegistered,
}
