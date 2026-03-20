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

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow template syntax errors in Blits component templates.',
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
        if (result.status) return

        const { type, info: message, ranges } = result.error
        if (type === 'MultipleRootElements') return

        const sourceText = context.sourceCode.getText()

        for (const range of ranges) {
          const loc = {
            start: indexToLoc(sourceText, contentOffset + range.start),
            end: indexToLoc(sourceText, contentOffset + range.end),
          }
          context.report({ loc, message })
        }
      },
    }
  },
}
