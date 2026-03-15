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

const NUMERIC_RE = /^-?\d+(\.\d+)?$/
const PERCENT_RE = /^-?\d+(\.\d+)?%$/

function buildValidator(descriptor) {
  if (Array.isArray(descriptor)) {
    const validators = descriptor.map(buildValidator)
    return (value) => {
      let lastFailure = null
      for (const v of validators) {
        const result = v(value)
        if (result === null) return null
        lastFailure = result
      }
      return lastFailure
    }
  }

  const { type, integer } = descriptor

  switch (type) {
    case 'enum': {
      const set = new Set(descriptor.values)
      return (value) =>
        set.has(value) ? null : { messageId: 'enumInvalid', data: { allowed: descriptor.values.join(', ') } }
    }
    case 'range': {
      const { min, max } = descriptor
      return (value) => {
        const num = Number(value)
        if (isNaN(num)) return { messageId: 'outOfRange', data: { min, max } }
        if (integer && !Number.isInteger(num)) return { messageId: 'notInteger', data: {} }
        if (num >= min && num <= max) return null
        return { messageId: 'outOfRange', data: { min, max } }
      }
    }
    case 'numeric': {
      return (value) => {
        const num = Number(value)
        if (isNaN(num)) return { messageId: 'notNumeric', data: {} }
        if (integer && !Number.isInteger(num)) return { messageId: 'notInteger', data: {} }
        return null
      }
    }
    case 'numericOrPercent': {
      return (value) => {
        if (NUMERIC_RE.test(value) || PERCENT_RE.test(value)) return null
        return { messageId: 'notNumericOrPercent', data: {} }
      }
    }
    case 'positive': {
      return (value) => {
        const num = Number(value)
        if (isNaN(num)) return { messageId: 'notPositive', data: {} }
        if (integer && !Number.isInteger(num)) return { messageId: 'notInteger', data: {} }
        if (num > 0) return null
        return { messageId: 'notPositive', data: {} }
      }
    }
    case 'nonNegative': {
      return (value) => {
        const num = Number(value)
        if (isNaN(num)) return { messageId: 'notNonNegative', data: {} }
        if (integer && !Number.isInteger(num)) return { messageId: 'notInteger', data: {} }
        if (num >= 0) return null
        return { messageId: 'notNonNegative', data: {} }
      }
    }
    case 'regex': {
      const re = new RegExp(descriptor.pattern)
      const msg = descriptor.message
      return (value) => (re.test(value) ? null : { messageId: 'regexMismatch', data: { message: msg } })
    }
    default:
      return () => null
  }
}

// Extract key: value pairs from a Blits template object string like {x: 0.5, y: 0}
function parseObjectValue(str) {
  const re = /(\w[\w-]*)\s*:\s*([^,}]+)/g
  const pairs = {}
  let m
  while ((m = re.exec(str)) !== null) {
    let val = m[2].trim()
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1)
    }
    pairs[m[1].trim()] = val
  }
  return pairs
}

const scalarValidators = new Map()
const objectValidators = new Map()
const usedInMap = new Map()

for (const [name, def] of Object.entries(templateAttrs)) {
  usedInMap.set(name, new Set(def.usedIn))
  if (!def.validate) continue
  if (def.validate.scalar) {
    scalarValidators.set(name, buildValidator(def.validate.scalar))
  }
  if (def.validate.object && Object.keys(def.validate.object).length > 0) {
    const propValidators = {}
    for (const [key, desc] of Object.entries(def.validate.object)) {
      propValidators[key] = buildValidator(desc)
    }
    objectValidators.set(name, propValidators)
  }
}

const BUILT_IN_TAGS = new Set(['Element', 'Text', 'Layout', 'RouterView', 'Component'])

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that static attribute values match the allowed set.',
    },
    messages: {
      enumInvalid: "'{{attr}}' value '{{value}}' is not valid. Use one of: {{allowed}}.",
      outOfRange: "'{{attr}}' value must be a number between {{min}} and {{max}}. Got '{{value}}'.",
      notNumeric: "'{{attr}}' expects a numeric value. Got '{{value}}'.",
      notNumericOrPercent: "'{{attr}}' expects a number or percentage string (e.g. '50%'). Got '{{value}}'.",
      notPositive: "'{{attr}}' value must be greater than 0. Got '{{value}}'.",
      notNonNegative: "'{{attr}}' value must be 0 or greater. Got '{{value}}'.",
      notInteger: "'{{attr}}' expects a whole number. Got '{{value}}'.",
      regexMismatch: '{{message}}',
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
            if (attr.name.text.startsWith(':')) continue // reactive binding

            const attrName = attr.name.text
            const validTags = usedInMap.get(attrName)
            if (validTags && !validTags.has(treeNode.tag)) continue // E-130 handles wrong-tag

            const value = attr.value.text.trim()
            if (value.startsWith('$')) continue // variable reference

            const loc = {
              start: indexToLoc(sourceText, contentOffset + attr.value.start),
              end: indexToLoc(sourceText, contentOffset + attr.value.end),
            }

            if (value.startsWith('{')) {
              const propValidators = objectValidators.get(attrName)
              if (!propValidators) continue

              const pairs = parseObjectValue(value)
              for (const [propKey, propVal] of Object.entries(pairs)) {
                const propValidator = propValidators[propKey]
                if (!propValidator) continue
                const failure = propValidator(propVal)
                if (failure !== null) {
                  context.report({
                    loc,
                    messageId: failure.messageId,
                    data: { attr: attrName, value: propVal, ...failure.data },
                  })
                }
              }
            } else {
              const validator = scalarValidators.get(attrName)
              if (!validator) continue
              const failure = validator(value)
              if (failure !== null) {
                context.report({
                  loc,
                  messageId: failure.messageId,
                  data: { attr: attrName, value, ...failure.data },
                })
              }
            }
          }
        }
      },
    }
  },
}
