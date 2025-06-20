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
const { getVirtualFileName } = require('./utils/fileNameGenerator')
const { getLanguageServiceInstance } = require('./languageService')
const { extractScriptContent } = require('./utils/scriptExtractor')

function registerHoverProvider(context) {
  const hoverProvider = vscode.languages.registerHoverProvider('blits', {
    provideHover(document, position) {
      const scriptInfo = extractScriptContent(document.getText())
      if (!scriptInfo) return

      const offset = document.offsetAt(position) - scriptInfo.startIndex
      if (offset < 0) return

      const virtualFileName = getVirtualFileName(document.uri, scriptInfo.lang)
      const { getLanguageService } = getLanguageServiceInstance()
      const languageService = getLanguageService(virtualFileName)

      if (!languageService) return

      try {
        const hoverInfo = languageService.getQuickInfoAtPosition(virtualFileName, offset)

        if (hoverInfo && hoverInfo.displayParts) {
          const contents = hoverInfo.displayParts.map((part) => part.text).join('')
          const markdown = new vscode.MarkdownString()
          markdown.appendCodeblock(contents, scriptInfo.lang === 'ts' ? 'typescript' : 'javascript')

          const range = document.getWordRangeAtPosition(position)
          return new vscode.Hover(markdown, range)
        }
      } catch (error) {
        // Silently handle errors when virtual files don't exist
        return
      }
    },
  })
  context.subscriptions.push(hoverProvider)
}

module.exports = { registerHoverProvider }
