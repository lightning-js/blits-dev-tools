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

function joinChildren(childNodes, childDocs) {
  return childDocs.flatMap((doc, i) => {
    if (i === 0) return [doc]
    return childNodes[i].blankBefore ? [hardline, hardline, doc] : [hardline, doc]
  })
}

function printAttrs(attrs, wrap, options) {
  if (!attrs || attrs.length === 0) return []
  return attrs.map((a) => {
    const val = options.blitsTrimAttributeValues ? a.value.replace(/^[ \t]+|[ \t]+$/g, '') : a.value
    return [wrap ? line : ' ', `${a.name}="${val}"`]
  })
}

function printElement(path, options, print) {
  const node = path.getValue()
  const wrap = options.blitsWrapAttributes
  const attrs = printAttrs(node.attrs, wrap, options)
  const hasChildren = node.children && node.children.length > 0

  if (node.tag === 'empty') {
    if (!hasChildren) return '<></>'
    const emptyChildDocs = joinChildren(node.children, path.map(print, 'children'))
    return ['<>', indent([hardline, emptyChildDocs]), hardline, '</>']
  }

  if (node.selfClosing) {
    if (wrap) {
      return group(['<', node.tag, indent(attrs), ifBreak('', ' '), softline, '/>'])
    }
    return ['<', node.tag, attrs, ' />']
  }

  const closingAngle = options.blitsBracketSameLine ? '>' : [softline, '>']
  const openTag = wrap
    ? group(['<', node.tag, indent(attrs), closingAngle])
    : ['<', node.tag, attrs, '>']

  if (!hasChildren) {
    if (options.blitsSelfClosingTags) {
      if (wrap) {
        return group(['<', node.tag, indent(attrs), ifBreak('', ' '), softline, '/>'])
      }
      return ['<', node.tag, attrs, ' />']
    }
    return [openTag, '</', node.tag, '>']
  }

  const childDocs = joinChildren(node.children, path.map(print, 'children'))
  return [openTag, indent([hardline, childDocs]), hardline, '</', node.tag, '>']
}

function print(path, options, print) {
  const node = path.getValue()

  switch (node.type) {
    case 'root': {
      const rootNode = path.getValue()
      return joinChildren(rootNode.children, path.map(print, 'children'))
    }
    case 'element':
      return printElement(path, options, print)
    case 'comment': {
      if (!options.blitsNormalizeComments) return node.text
      const inner = node.text.replace(/^<!--+\s*/, '').replace(/\s*--+>$/, '').trim()
      return `<!-- ${inner} -->`
    }
    case 'text':
      return node.value
    default:
      return ''
  }
}

module.exports = { print }
