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

const parseTemplate = require('./parser')
const { getBlitsTemplate, indexToLoc } = require('./utils')

let _fileText = null

module.exports = {
  // we don't actually need to transform the text for linting
  // we'll ignore `messagesLists` entirely and re-run our parser
  preprocess(text, filename) {
    _fileText = text
    return [text]
  },

  postprocess(_messagesLists, filename) {
    const fileText = _fileText
    const tpl = getBlitsTemplate(fileText)
    if (!tpl) return [] // no <template> block -> no errors

    const result = parseTemplate(tpl.content)
    if (result.status) return []

    return result.error.ranges.map((range) => {
      const absStart = tpl.start + range.start
      const absEnd = tpl.start + range.end
      const startLoc = indexToLoc(fileText, absStart)
      const endLoc = indexToLoc(fileText, absEnd)

      return {
        ruleId: '@lightningjs/blits/template-validate',
        message: result.error.info,
        severity: 2, // error
        line: startLoc.line,
        column: startLoc.column,
        endLine: endLoc.line,
        endColumn: endLoc.column,
      }
    })
  },

  supportsAutofix: false,
}
