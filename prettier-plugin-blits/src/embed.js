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

const { doc } = require('prettier')

const { hardline, softline, indent, group } = doc.builders

function isBlitsTemplate(path) {
  const node = path.getValue()
  const isTemplateLiteral = node.type === 'TemplateLiteral'
  const isSingleQuotedLiteral = node.type === 'Literal' && typeof node.value === 'string' && node.raw?.startsWith("'")

  if (!isTemplateLiteral && !isSingleQuotedLiteral) return false

  return path.match(
    () => true,

    (node, name) =>
      (node.type === 'ObjectProperty' || node.type === 'Property') &&
      !node.computed &&
      node.key.type === 'Identifier' &&
      node.key.name === 'template' &&
      name === 'value',

    (node, name) => node.type === 'ObjectExpression' && name === 'properties',

    (node, name) =>
      name === 'arguments' &&
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'Blits' &&
      node.callee.property.type === 'Identifier' &&
      (node.callee.property.name === 'Component' || node.callee.property.name === 'Application')
  )
}

function embed(path, _options) {
  if (!isBlitsTemplate(path)) return undefined

  return async (textToDoc, print, path, options) => {
    const node = path.getValue()

    if (node.type === 'TemplateLiteral' && (node.quasis.length !== 1 || node.expressions.length !== 0)) {
      return undefined
    }

    const text = node.type === 'TemplateLiteral' ? node.quasis[0].value.raw : node.value

    if (!text || text.trim() === '') return undefined

    let formattedDoc
    try {
      formattedDoc = await textToDoc(text, { ...options, parser: 'blits-template' })
    } catch {
      return undefined
    }

    if (node.type === 'TemplateLiteral') {
      const isMultiLine = text.startsWith('\n') || text.startsWith('\r\n')
      const collapseAllowed = options.blitsCollapseSingleElement === true

      if (isMultiLine && !collapseAllowed) {
        const closingBacktick = options.blitsClosingBacktick === 'inline' ? '`' : [hardline, '`']
        return ['`', indent([hardline, formattedDoc]), closingBacktick]
      }

      const closingBacktick = options.blitsClosingBacktick === 'inline' ? '`' : [softline, '`']
      return group(['`', indent([softline, formattedDoc]), closingBacktick])
    } else {
      return ["'", formattedDoc, "'"]
    }
  }
}

module.exports = { embed }
