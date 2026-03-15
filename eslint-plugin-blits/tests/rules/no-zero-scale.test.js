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
const rule = require('../../lib/rules/no-zero-scale')

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } })

describe('no-zero-scale: valid cases', () => {
  test('non-zero scale values are accepted', () => {
    tester.run('no-zero-scale', rule, {
      valid: [
        { code: `Blits.Component('Foo', { template: '<Element scale="1" />' })` },
        { code: `Blits.Component('Foo', { template: '<Element scale="0.5" />' })` },
        { code: `Blits.Component('Foo', { template: '<Element scale="2" />' })` },
      ],
      invalid: [],
    })
  })

  test('reactive scale binding is ignored', () => {
    tester.run('no-zero-scale', rule, {
      valid: [{ code: `Blits.Component('Foo', { template: '<Element :scale="$s" />' })` }],
      invalid: [],
    })
  })

  test('template with syntax errors is skipped', () => {
    tester.run('no-zero-scale', rule, {
      valid: [{ code: `Blits.Component('Foo', { template: '<Element scale="0"></Text>' })` }],
      invalid: [],
    })
  })
})

describe('no-zero-scale: invalid cases', () => {
  test('reports scale of 0 in Blits.Component', () => {
    tester.run('no-zero-scale', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element scale="0" />' })`,
          errors: [{ messageId: 'zeroScale' }],
        },
      ],
    })
  })

  test('reports scale of 0 in Blits.Application', () => {
    tester.run('no-zero-scale', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Application({ template: '<Element scale="0" />' })`,
          errors: [{ messageId: 'zeroScale' }],
        },
      ],
    })
  })

  test('reports on nested elements', () => {
    tester.run('no-zero-scale', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element><Text scale="0" /></Element>' })`,
          errors: [{ messageId: 'zeroScale' }],
        },
      ],
    })
  })

  test('reports in template literal', () => {
    tester.run('no-zero-scale', rule, {
      valid: [],
      invalid: [
        {
          code: 'Blits.Component(\'Foo\', { template: `<Element scale="0" />` })',
          errors: [{ messageId: 'zeroScale' }],
        },
      ],
    })
  })
})
