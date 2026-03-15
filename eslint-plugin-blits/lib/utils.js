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

const TEMPLATE_RE = /(<template>)([\s\S]*?)(<\/template>)/

function getBlitsTemplate(fileText) {
  const m = fileText.match(TEMPLATE_RE)
  if (!m) return null
  // inner content without the tags
  const content = m[2]
  const start = m.index + m[1].length
  return { content, start }
}

/**
 * Convert an absolute character-offset into ESLint loc:
 *  - line is 1-based
 *  - column is 0-based
 */
function indexToLoc(text, index) {
  const lines = text.slice(0, index).split('\n')
  return {
    line: lines.length,
    column: lines[lines.length - 1].length,
  }
}

// from the vscode extension, checks template values outside of component configs
function isValidTemplateString(str) {
  // Early returns for empty or non-string inputs
  if (!str || typeof str !== 'string') {
    return false
  }

  // Trim whitespace but preserve newlines
  str = str.replace(/^\s+|\s+$/gm, '')

  // Quick checks for obvious template indicators
  if (str.startsWith('<!--')) {
    return true
  }

  // Look for reactive bindings or event handlers
  if (str.includes(':') || str.includes('@')) {
    const hasAttribute = /[:@][a-zA-Z][^=]*=/.test(str)
    if (hasAttribute) {
      return true
    }
  }

  // Look for any tag-like structures, being permissive with whitespace
  const hasTagLikeStructure =
    /<[a-zA-Z][a-zA-Z0-9_-]*[\s\S]*?>/.test(str) || /<[a-zA-Z][a-zA-Z0-9_-]*[\s\S]*$/.test(str)

  if (!hasTagLikeStructure) {
    return false
  }

  // Check for template structure indicators (including incomplete)
  const templateIndicators = [
    // Complete tag with attributes across multiple lines
    /<[a-zA-Z][a-zA-Z0-9_-]*[\s\S]*?>/,
    // Self-closing tag across multiple lines
    /<[a-zA-Z][a-zA-Z0-9_-]*[\s\S]*?\/>/,
    // Closing tag (even incomplete)
    /<\/[a-zA-Z][a-zA-Z0-9_-]*/,
    // Incomplete opening tag with attributes
    /<[a-zA-Z][a-zA-Z0-9_-]*[\s\S]*$/,
    // Tag with reactive binding or event handler
    /<[a-zA-Z][a-zA-Z0-9_-]*[\s\S]*?[:@][a-zA-Z]/,
  ]

  // If we match any of these patterns, consider it a template
  for (const pattern of templateIndicators) {
    if (pattern.test(str)) {
      // Check for text before the first '<'
      const firstTagIndex = str.indexOf('<')
      if (firstTagIndex > 0) {
        const preText = str.slice(0, firstTagIndex).trim()
        if (preText && !preText.startsWith('<!--')) {
          return false
        }
      }
      return true
    }
  }

  return false
}

function isBlitsCall(node) {
  return (
    node.callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object &&
    node.callee.object.name === 'Blits' &&
    node.callee.property &&
    (node.callee.property.name === 'Component' || node.callee.property.name === 'Application')
  )
}

function getTemplateInfo(callNode) {
  if (!isBlitsCall(callNode)) return null

  const args = callNode.arguments
  if (!args || args.length === 0) return null

  const config = args[args.length - 1]
  if (!config || config.type !== 'ObjectExpression') return null

  const templateProp = config.properties.find(
    (p) => !p.computed && p.key && (p.key.name === 'template' || p.key.value === 'template')
  )
  if (!templateProp || !templateProp.value) return null

  const valueNode = templateProp.value
  let templateStr, contentOffset

  if (valueNode.type === 'Literal' && typeof valueNode.value === 'string') {
    templateStr = valueNode.value
    contentOffset = valueNode.range[0] + 1
  } else if (
    valueNode.type === 'TemplateLiteral' &&
    valueNode.expressions.length === 0 &&
    valueNode.quasis.length === 1
  ) {
    templateStr = valueNode.quasis[0].value.raw
    contentOffset = valueNode.range[0] + 1
  } else {
    return null
  }

  return { templateStr, contentOffset }
}

module.exports = { getBlitsTemplate, indexToLoc, isValidTemplateString, isBlitsCall, getTemplateInfo }
