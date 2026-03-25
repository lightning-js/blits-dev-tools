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
const rule = require('../../lib/rules/require-single-root-element')

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } })

describe('require-single-root-element: valid cases', () => {
  test('single root element is accepted', () => {
    tester.run('require-single-root-element', rule, {
      valid: [
        { code: `Blits.Component('Foo', { template: '<Element />' })` },
        { code: `Blits.Component('Foo', { template: '<Element><Text /></Element>' })` },
        { code: `Blits.Application({ template: '<Element />' })` },
        { code: `Blits.Component('Foo', { template: \`<Element />\` })` },
        { code: `Blits.Component('Foo', { template: '' })` },
      ],
      invalid: [],
    })
  })

  test('non-Blits calls are ignored', () => {
    tester.run('require-single-root-element', rule, {
      valid: [{ code: `someOtherLib.Component('Foo', { template: '<Element /><Text />' })` }],
      invalid: [],
    })
  })
})

describe('require-single-root-element: invalid cases', () => {
  test('reports two sibling root elements in Blits.Component', () => {
    tester.run('require-single-root-element', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element /><Text />' })`,
          errors: [{ messageId: 'multipleRoots' }],
        },
      ],
    })
  })

  test('reports two sibling root elements in Blits.Application', () => {
    tester.run('require-single-root-element', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Application({ template: '<Element /><Text />' })`,
          errors: [{ messageId: 'multipleRoots' }],
        },
      ],
    })
  })

  test('reports multiple root elements in template literal', () => {
    tester.run('require-single-root-element', rule, {
      valid: [],
      invalid: [
        {
          code: 'Blits.Component(\'Foo\', { template: `<Element /><Text />` })',
          errors: [{ messageId: 'multipleRoots' }],
        },
      ],
    })
  })

  test('reports open/close pair followed by another element', () => {
    tester.run('require-single-root-element', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Component('Foo', { template: '<Element></Element><Text />' })`,
          errors: [{ messageId: 'multipleRoots' }],
        },
      ],
    })
  })
})
