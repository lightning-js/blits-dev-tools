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

/**
 * Utility for escaping and unescaping arrow functions in template strings.
 * This prevents TypeScript/JavaScript parsers from misinterpreting => as part of code
 * when it's actually an arrow function inside an HTML attribute value.
 */

const ARROW_FUNCTION_PLACEHOLDER = '___ARROW_FUNCTION___'

/**
 * Escapes arrow functions in event handler attributes (e.g., @loaded, @error, @updated)
 * by replacing them with placeholders.
 */
function escapeArrowFunctions(template) {
  const arrowFunctions = []

  // Match attributes with values that contain =>
  const escapedTemplate = template.replace(/=["']([^"']*?)["']/g, (match, attrValue) => {
    if (attrValue.includes('=>')) {
      const index = arrowFunctions.length
      arrowFunctions.push(attrValue)
      return `="${ARROW_FUNCTION_PLACEHOLDER}${index}"`
    }
    return match
  })

  return {
    template: escapedTemplate,
    arrowFunctions
  }
}

/**
 * Restores arrow functions that were escaped by escapeArrowFunctions.
 */
function unescapeArrowFunctions(template, arrowFunctions) {
  let result = template

  arrowFunctions.forEach((originalValue, index) => {
    const placeholder = `${ARROW_FUNCTION_PLACEHOLDER}${index}`
    result = result.replace(placeholder, originalValue)
  })

  return result
}

module.exports = {
  escapeArrowFunctions,
  unescapeArrowFunctions,
  ARROW_FUNCTION_PLACEHOLDER
}
