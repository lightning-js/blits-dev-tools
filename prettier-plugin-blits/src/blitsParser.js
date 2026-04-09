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

// Sourced from eslint-plugin-blits/lib/parser.js (release/eslint-plugin-blits-v1.0.0)
// Kept as a local copy to avoid a cross-package runtime dependency
const parseTemplate = require('./parser.cjs')

function buildTree(flatTree, text, preserveBlankLines = true) {
  const nodes = Object.values(flatTree)
  const stack = []
  const roots = []

  for (const node of nodes) {
    if (node.type === 'whitespace') continue
    if (node.type === 'tag' && node.tagType === 'closing') continue

    let hierarchicalNode

    if (node.type === 'comment') {
      hierarchicalNode = {
        type: 'comment',
        text: node.nodeText,
        start: node.start,
        end: node.end,
      }
    } else if (node.type === 'tag') {
      hierarchicalNode = {
        type: 'element',
        tag: node.tag,
        selfClosing: node.tagType === 'self-closing',
        attrs: (node.attrs || []).map((a) => ({
          name: a.name.text,
          value: a.value.text,
        })),
        children: [],
        start: node.start,
        end: node.end,
      }

      if (node.content && node.content.node) {
        hierarchicalNode.children.push({
          type: 'text',
          value: text ? text.slice(node.content.start, node.content.end) : node.content.node,
          start: node.content.start,
          end: node.content.end,
        })
      }
    }

    if (!hierarchicalNode) continue

    while (stack.length > 0 && stack[stack.length - 1]._level >= node.level) {
      stack.pop()
    }

    const targetArray = stack.length === 0 ? roots : stack[stack.length - 1].children
    const prev = targetArray[targetArray.length - 1]
    if (preserveBlankLines && prev && prev.end != null && /\n[ \t]*\n/.test(text.slice(prev.end, node.start))) {
      hierarchicalNode.blankBefore = true
    }
    targetArray.push(hierarchicalNode)

    if (hierarchicalNode.type === 'element' && !hierarchicalNode.selfClosing) {
      hierarchicalNode._level = node.level
      stack.push(hierarchicalNode)
    }
  }

  function cleanNode(n) {
    delete n._level
    if (n.children) n.children.forEach(cleanNode)
  }
  roots.forEach(cleanNode)

  return roots
}

function parse(text, options) {
  const result = parseTemplate(text)
  if (!result.status || !result.tree) {
    throw new Error(result.error?.info ?? 'Failed to parse Blits template')
  }
  const roots = buildTree(result.tree, text, options?.blitsPreserveBlankLines !== false)
  return { type: 'root', children: roots, start: 0, end: text.length }
}

module.exports = { parse }
