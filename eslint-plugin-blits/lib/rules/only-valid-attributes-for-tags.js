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

const parseTemplate = require('../parser')
const { getTemplateInfo, indexToLoc } = require('../utils')
const templateAttrs = require('../../data/template-attributes.json')

const attrTagMap = new Map(
  Object.entries(templateAttrs).map(([name, def]) => [name, new Set(def.usedIn)])
)

const BUILT_IN_TAGS = new Set(['Element', 'Text', 'Layout', 'RouterView'])

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "Disallow attributes on built-in elements that don't support them.",
    },
    messages: {
      invalidAttr: "'{{attr}}' is not a valid attribute for '<{{tag}}>'.",
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        const info = getTemplateInfo(node)
        if (!info) return

        const { templateStr, contentOffset } = info
        const result = parseTemplate(templateStr)
        if (!result.status) return

        const sourceText = context.sourceCode.getText()

        for (const treeNode of Object.values(result.tree)) {
          if (treeNode.type !== 'tag' || treeNode.tagType === 'closing') continue
          if (!BUILT_IN_TAGS.has(treeNode.tag)) continue

          for (const attr of treeNode.attrs) {
            // Strip ':' prefix for reactive bindings; events keep their '@' prefix
            const lookup = attr.name.text.startsWith(':')
              ? attr.name.text.slice(1)
              : attr.name.text

            const validTags = attrTagMap.get(lookup)
            if (!validTags) {
              // Event handlers (@) and transition modifiers (.transition etc.) are not in the schema.
              if (!attr.name.text.startsWith('@') && !lookup.includes('.')) {
                const loc = {
                  start: indexToLoc(sourceText, contentOffset + attr.name.start),
                  end: indexToLoc(sourceText, contentOffset + attr.name.end),
                }
                context.report({ loc, messageId: 'invalidAttr', data: { attr: lookup, tag: treeNode.tag } })
              }
              continue
            }

            if (!validTags.has(treeNode.tag)) {
              const loc = {
                start: indexToLoc(sourceText, contentOffset + attr.name.start),
                end: indexToLoc(sourceText, contentOffset + attr.name.end),
              }
              context.report({ loc, messageId: 'invalidAttr', data: { attr: lookup, tag: treeNode.tag } })
            }
          }
        }
      },
    }
  },
}
