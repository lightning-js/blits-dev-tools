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

const parseAST = require('../parsers/parseAST')
const traverse = require('@babel/traverse').default

const getASTForDocument = (document) => {
  const currentDoc = document.getText()
  const isBlits = document.languageId === 'blits'

  if (isBlits) {
    const { content, language } = getBlitsScript(currentDoc)
    return parseAST(content, language)
  }

  const AST = parseAST(currentDoc, document.uri.fsPath.split('.').pop())
  return AST
}

// const getAllTemplates = (document) => {
//   const currentDoc = document.getText()

//   if (document.languageId === 'blits') {
//     const template = getBlitsTemplate(currentDoc, true)
//     if (template) {
//       return [
//         {
//           start: template.start,
//           end: template.end,
//           content: template.content,
//           type: 'template',
//         },
//       ]
//     }
//     return []
//   }

//   const ast = getASTForDocument(document)
//   return getAllComponentTemplates(ast, currentDoc).map((t) => ({
//     ...t,
//     type: 'template-literal',
//   }))
// }

const getAllTemplates = (document) => {
  const currentDoc = document.getText()

  if (document.languageId === 'blits') {
    const template = getBlitsTemplate(currentDoc, true)
    if (template) {
      return [
        {
          start: template.start,
          end: template.end,
          content: template.content,
          type: 'template',
        },
      ]
    }
    return []
  }

  // Try regex-based detection first
  const regexResults = getAllComponentTemplatesRegex(currentDoc)

  // Try AST-based detection as fallback/validation
  // try {
  //   const ast = getASTForDocument(document)
  //   if (ast) {
  //     const astResults = getAllComponentTemplates(ast, currentDoc)

  //     // If AST parsing succeeded and found results, merge them
  //     if (astResults.length > 0) {
  //       // Merge results, preferring AST results for overlapping ranges
  //       const mergedResults = [...regexResults]

  //       astResults.forEach((astResult) => {
  //         // Check if this AST result overlaps with any regex result
  //         const overlapping = regexResults.some(
  //           (regexResult) =>
  //             Math.abs(astResult.start - regexResult.start) < 10 && Math.abs(astResult.end - regexResult.end) < 10
  //         )

  //         if (!overlapping) {
  //           mergedResults.push(astResult)
  //         }
  //       })

  //       return mergedResults.map((t) => ({
  //         ...t,
  //         type: 'template-literal',
  //       }))
  //     }
  //   }
  // } catch (error) {
  //   // AST parsing failed, fall back to regex results
  //   console.log('AST parsing failed, using regex-based template detection:', error.message)
  // }

  // Return regex results with proper type
  return regexResults.map((t) => ({
    ...t,
    type: 'template-literal',
  }))
}
const isBlitsFile = (document) => {
  return document.languageId === 'blits'
}

const getBlitsTemplate = (fileContent, includeTemplateTags = false) => {
  const templateRegex = /(<template>)([\s\S]*?)(<\/template>)/
  const match = fileContent.match(templateRegex)

  if (match) {
    const fullMatch = match[0]
    const innerContent = match[2]

    if (includeTemplateTags) {
      return {
        content: fullMatch,
        start: match.index,
        end: match.index + fullMatch.length,
      }
    } else {
      const startOffset = match.index + match[1].length
      const endOffset = match.index + fullMatch.length - match[3].length

      return {
        content: innerContent,
        start: startOffset,
        end: endOffset,
      }
    }
  }

  return null
}

const getBlitsScript = (fileContent) => {
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/
  const scriptMatch = fileContent.match(scriptRegex)
  if (scriptMatch) {
    const scriptAttributes = scriptMatch[1].trim()
    const langMatch = scriptAttributes.match(/lang=['"]?(ts|js)['"]?/)
    const language = langMatch ? langMatch[1] : 'js'

    const scriptContentStart = scriptMatch.index + scriptMatch[0].indexOf('>') + 1
    const scriptContentEnd = scriptContentStart + scriptMatch[2].length

    return {
      content: scriptMatch[2],
      start: scriptContentStart,
      end: scriptContentEnd,
      language,
    }
  }

  return null
}

const getBlitsFileContent = (document) => {
  const fileContent = document.getText()

  let result = {
    template: null,
    script: null,
  }

  result.template = getBlitsTemplate(fileContent)
  result.script = getBlitsScript(fileContent)

  return result
}

function getAllComponentTemplatesRegex(sourceCode) {
  const ranges = []
  const processedRanges = new Set()

  // Find all 'template' followed by colon occurrences
  const templateKeyRegex = /\btemplate\s*:/g
  let match

  while ((match = templateKeyRegex.exec(sourceCode)) !== null) {
    const keyStart = match.index
    const keyEnd = keyStart + match[0].length

    // Move cursor to start looking for the value
    let cursor = keyEnd

    // Skip whitespace
    while (cursor < sourceCode.length && /\s/.test(sourceCode[cursor])) {
      cursor++
    }

    if (cursor >= sourceCode.length) continue

    // Must find a quote character
    const quoteChar = sourceCode[cursor]
    if (!['"', "'", '`'].includes(quoteChar)) continue

    // Extract the string value between quotes
    const stringStartPos = cursor
    cursor++ // Move past opening quote
    const contentStartPos = cursor

    // Handle different quote types differently for template literals
    if (quoteChar === '`') {
      // Template literal - need to handle ${} interpolations
      let braceLevel = 0
      let escaped = false

      while (cursor < sourceCode.length) {
        const char = sourceCode[cursor]

        if (escaped) {
          escaped = false
        } else if (char === '\\') {
          escaped = true
        } else if (char === '`' && braceLevel === 0) {
          // Found closing backtick
          cursor++
          break
        } else if (char === '$' && cursor + 1 < sourceCode.length && sourceCode[cursor + 1] === '{') {
          braceLevel++
          cursor++ // Skip the {
        } else if (char === '}' && braceLevel > 0) {
          braceLevel--
        }

        cursor++
      }
    } else {
      // Regular string - find matching quote
      let escaped = false

      while (cursor < sourceCode.length) {
        const char = sourceCode[cursor]

        if (escaped) {
          escaped = false
        } else if (char === '\\') {
          escaped = true
        } else if (char === quoteChar) {
          // Found closing quote
          cursor++
          break
        }

        cursor++
      }
    }

    // Check if we successfully found the closing quote
    if (cursor <= contentStartPos || sourceCode[cursor - 1] !== quoteChar) {
      continue
    }

    const contentEndPos = cursor - 1
    const valueEnd = cursor

    // Extract the content between quotes (not including the quotes themselves)
    const templateContent = sourceCode.slice(contentStartPos, contentEndPos)

    // Use existing validation to check if this is a valid template
    if (templateContent && _isValidTemplateString(templateContent)) {
      const rangeKey = `${stringStartPos}-${valueEnd}`

      if (!processedRanges.has(rangeKey)) {
        processedRanges.add(rangeKey)

        // Create the range object matching the format expected by existing code
        ranges.push({
          start: stringStartPos,
          end: valueEnd,
          content: sourceCode.substring(stringStartPos, valueEnd), // Include quotes for compatibility
        })
      }
    }
  }

  return ranges
}

const getAllComponentTemplates = (ast, sourceCode) => {
  // Return early if AST is invalid
  if (!ast || !ast.program) {
    console.warn('Invalid AST provided to getAllComponentTemplates')
    return []
  }

  const ranges = []
  const processedRanges = new Set()

  try {
    traverse(ast, {
      // Handle Blits.Component and Blits.Application calls
      CallExpression(path) {
        try {
          const { node } = path
          if (!node || !node.callee) return

          // Type guard for MemberExpression
          if (node.callee.type !== 'MemberExpression') return

          // Now TypeScript knows callee is a MemberExpression and has object and property
          const { object, property } = node.callee

          // Type guard for Identifier
          if (object.type !== 'Identifier' || property.type !== 'Identifier') return

          if (object.name === 'Blits' && (property.name === 'Component' || property.name === 'Application')) {
            const configArgIndex = property.name === 'Component' ? 1 : 0
            if (!node.arguments || node.arguments.length <= configArgIndex) return

            const configObject = node.arguments[configArgIndex]
            if (!configObject || configObject.type !== 'ObjectExpression') return

            // Safely iterate through properties
            if (!configObject.properties || !Array.isArray(configObject.properties)) return

            configObject.properties.forEach((prop) => {
              try {
                // Type guard for ObjectProperty
                if (prop.type !== 'ObjectProperty') return

                // Type guard for Identifier
                if (prop.key.type !== 'Identifier') return

                if (prop.key.name === 'template') {
                  let unwrapped = null

                  // Handle TemplateLiteral
                  if (
                    prop.value.type === 'TemplateLiteral' &&
                    prop.value.quasis &&
                    prop.value.quasis.length > 0 &&
                    prop.value.quasis[0].value
                  ) {
                    unwrapped = prop.value.quasis[0].value.raw
                  }
                  // Handle StringLiteral
                  else if (prop.value.type === 'StringLiteral') {
                    unwrapped = prop.value.value
                  }

                  if (
                    unwrapped !== null &&
                    typeof prop.value.start === 'number' &&
                    typeof prop.value.end === 'number'
                  ) {
                    const rangeKey = `${prop.value.start}-${prop.value.end}`
                    processedRanges.add(rangeKey)

                    // Safely get content
                    let content = null
                    if (sourceCode && typeof sourceCode === 'string') {
                      try {
                        content = sourceCode.substring(prop.value.start, prop.value.end)
                      } catch (e) {
                        console.warn('Error extracting source content:', e)
                      }
                    }

                    ranges.push({
                      start: prop.value.start,
                      end: prop.value.end,
                      content: content,
                    })
                  }
                }
              } catch (propError) {
                console.warn('Error processing property:', propError)
                // Continue to next property
              }
            })
          }
        } catch (visitorError) {
          console.warn('Error in CallExpression visitor:', visitorError)
          // Continue traversal
        }
      },

      // Handle any object with a template property
      ObjectExpression(path) {
        try {
          const { node } = path
          if (!node || !node.properties || !Array.isArray(node.properties)) return

          node.properties.forEach((prop) => {
            try {
              // Type guard for ObjectProperty
              if (prop.type !== 'ObjectProperty') return

              // Type guard for Identifier
              if (prop.key.type !== 'Identifier') return

              if (prop.key.name === 'template') {
                let unwrapped = null

                // Handle TemplateLiteral
                if (
                  prop.value.type === 'TemplateLiteral' &&
                  prop.value.quasis &&
                  prop.value.quasis.length > 0 &&
                  prop.value.quasis[0].value
                ) {
                  unwrapped = prop.value.quasis[0].value.raw
                }
                // Handle StringLiteral
                else if (prop.value.type === 'StringLiteral') {
                  unwrapped = prop.value.value
                }

                // Only process if range hasn't been processed and template is valid
                if (unwrapped !== null && typeof prop.value.start === 'number' && typeof prop.value.end === 'number') {
                  const rangeKey = `${prop.value.start}-${prop.value.end}`

                  if (!processedRanges.has(rangeKey)) {
                    try {
                      if (_isValidTemplateString(unwrapped)) {
                        // Safely get content
                        let content = null
                        if (sourceCode && typeof sourceCode === 'string') {
                          try {
                            content = sourceCode.substring(prop.value.start, prop.value.end)
                          } catch (e) {
                            console.warn('Error extracting source content:', e)
                          }
                        }

                        processedRanges.add(rangeKey)
                        ranges.push({
                          start: prop.value.start,
                          end: prop.value.end,
                          content: content,
                        })
                      }
                    } catch (templateValidationError) {
                      console.warn('Error validating template string:', templateValidationError)
                    }
                  }
                }
              }
            } catch (propError) {
              console.warn('Error processing property in ObjectExpression:', propError)
              // Continue to next property
            }
          })
        } catch (visitorError) {
          console.warn('Error in ObjectExpression visitor:', visitorError)
          // Continue traversal
        }
      },
    })
  } catch (traversalError) {
    console.error('Fatal error during AST traversal:', traversalError)
    // Return whatever we've collected so far
  }

  return ranges
}

function _isValidTemplateString(str) {
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

module.exports = {
  getASTForDocument,
  getAllTemplates,
  isBlitsFile,
  getBlitsTemplate,
  getBlitsScript,
  getBlitsFileContent,
  getAllComponentTemplates,
}
