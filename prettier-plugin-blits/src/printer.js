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

const { hardline, softline, line, group, indent, join, ifBreak } = doc.builders

function printAttrs(attrs, wrap) {
  if (!attrs || attrs.length === 0) return []
  return attrs.map((a) => [wrap ? line : ' ', `${a.name}="${a.value}"`])
}

function printElement(path, options, print) {
  const node = path.getValue()
  const wrap = options.blitsWrapAttributes
  const attrs = printAttrs(node.attrs, wrap)
  const hasChildren = node.children && node.children.length > 0

  if (node.tag === 'empty') {
    if (!hasChildren) return '<></>'
    return ['<>', indent([hardline, join(hardline, path.map(print, 'children'))]), hardline, '</>']
  }

  if (node.selfClosing) {
    if (wrap) {
      return group(['<', node.tag, indent(attrs), ifBreak('', ' '), softline, '/>'])
    }
    return ['<', node.tag, attrs, ' />']
  }

  const openTag = wrap
    ? group(['<', node.tag, indent(attrs), softline, '>'])
    : ['<', node.tag, attrs, '>']

  if (!hasChildren) {
    return [openTag, '</', node.tag, '>']
  }

  return [
    openTag,
    indent([hardline, join(hardline, path.map(print, 'children'))]),
    hardline,
    '</',
    node.tag,
    '>',
  ]
}

function print(path, options, print) {
  const node = path.getValue()

  switch (node.type) {
    case 'root':
      return join(hardline, path.map(print, 'children'))
    case 'element':
      return printElement(path, options, print)
    case 'comment':
      return node.text
    case 'text':
      return node.value
    default:
      return ''
  }
}

module.exports = { print }
