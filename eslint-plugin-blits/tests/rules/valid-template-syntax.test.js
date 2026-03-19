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

const { test, describe } = require('node:test')
const { RuleTester } = require('eslint')
const rule = require('../../lib/rules/valid-template-syntax')

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } })

describe('valid-template-syntax: valid cases', () => {
  test('well-formed templates are accepted', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [
        { code: `Blits.Component('Foo', { template: '<Element />' })` },
        { code: `Blits.Component('Foo', { template: '<Element><Text /></Element>' })` },
        { code: `Blits.Application({ template: '<Element />' })` },
        { code: `Blits.Component('Foo', { template: \`<Element w="100" h="200" />\` })` },
        { code: `Blits.Component('Foo', { template: '<Element :color="$color" @click="$handle" />' })` },
      ],
      invalid: [],
    })
  })

  test('multiple root elements are not reported (handled by require-single-root-element)', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [{ code: `Blits.Component('Foo', { template: '<Element /><Text />' })` }],
      invalid: [],
    })
  })

  test('non-Blits calls are ignored', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [
        { code: `someOtherLib.Component('Foo', { template: '<Element></Text>' })` },
        { code: `Blits.Other('Foo', { template: '<Element></Text>' })` },
      ],
      invalid: [],
    })
  })
})

describe('valid-template-syntax: mismatched tags', () => {
  test('reports mismatched tag pair (2 locations: opening and closing tag)', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element></Text>' })`,
          errors: [
            { message: 'Expected closing tag for <Element> but found </Text>. Tags must be properly nested.' },
            { message: 'Expected closing tag for <Element> but found </Text>. Tags must be properly nested.' },
          ],
        },
      ],
    })
  })

  test('reports unmatched closing tag', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '</Element>' })`,
          errors: [{ message: 'No matching opening tag found for this closing tag.' }],
        },
      ],
    })
  })

  test('reports self-closing closing tag', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element></Element />' })`,
          errors: [{ message: 'Closing tags cannot be self-closing. Remove the "/" at the end.' }],
        },
      ],
    })
  })
})

describe('valid-template-syntax: attribute errors', () => {
  test('reports attributes on closing tag', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element></Element color="red">' })`,
          errors: [
            { message: 'Closing tags cannot have attributes. Remove the attributes from the closing tag.' },
          ],
        },
      ],
    })
  })

  test('reports redundant attribute (2 locations: first and second occurrence)', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element color="red" color="blue" />' })`,
          errors: [
            { message: 'Attribute "color" is already defined on this element.' },
            { message: 'Attribute "color" is already defined on this element.' },
          ],
        },
      ],
    })
  })

  test('reports missing attribute value', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element color />' })`,
          errors: [{ message: 'Attribute must have a value. Add ="value" or remove the attribute.' }],
        },
      ],
    })
  })

  test('reports unclosed attribute value', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element color="red />' })`,
          errors: [{ message: 'Attribute value is not properly closed. Add a matching closing quote.' }],
        },
      ],
    })
  })

  test('reports missing whitespace between attributes', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element color="red"w="100" />' })`,
          errors: [{ message: 'Attributes must be separated by whitespace.' }],
        },
      ],
    })
  })

  test('reports invalid attribute name', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element !invalid="x" />' })`,
          errors: [
            {
              message:
                'Invalid attribute name. Attribute names must contain only letters, numbers, and these special characters: : . - _ @',
            },
          ],
        },
      ],
    })
  })
})

describe('valid-template-syntax: invalid tag', () => {
  test('reports invalid tag syntax', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<*invalid />' })`,
          errors: [{ message: 'This tag is not valid according to Blits syntax.' }],
        },
      ],
    })
  })
})

describe('valid-template-syntax: template literal', () => {
  test('reports errors in template literal templates', () => {
    tester.run('valid-template-syntax', rule, {
      valid: [],
      invalid: [
        {
          code: 'Blits.Component(\'Foo\', { template: `<Element></Text>` })',
          errors: [
            { message: 'Expected closing tag for <Element> but found </Text>. Tags must be properly nested.' },
            { message: 'Expected closing tag for <Element> but found </Text>. Tags must be properly nested.' },
          ],
        },
      ],
    })
  })
})
