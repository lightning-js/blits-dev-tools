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
const rule = require('../../lib/rules/valid-attribute-value')

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } })

const tmpl = (t) => `Blits.Component('Foo', { template: '${t}' })`

describe('valid-attribute-value: clipping', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element clipping="true" />') },
        { code: tmpl('<Element clipping="false" />') },
        { code: tmpl('<Text clipping="true" />') },
        { code: tmpl('<RouterView clipping="false" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element clipping="yes" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Element clipping="1" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })

  test('reactive binding and variable reference are not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element :clipping="$clip" />') },
        { code: tmpl('<Element clipping="$clipState" />') },
      ],
      invalid: [],
    })
  })
})

describe('valid-attribute-value: overflow', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element overflow="true" />') },
        { code: tmpl('<Element overflow="false" />') },
        { code: tmpl('<Text overflow="true" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element overflow="hidden" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Text overflow="visible" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: rtt', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element rtt="true" />') },
        { code: tmpl('<Element rtt="false" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element rtt="enabled" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: fit', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element fit="cover" />') },
        { code: tmpl('<Element fit="contain" />') },
      ],
      invalid: [],
    })
  })

  test('valid object keys and values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element fit="{type: cover, position: 0}" />') },
        { code: tmpl('<Element fit="{type: contain}" />') },
        { code: tmpl('<Element fit="{type: cover, position: {x: 0, y: 0}}" />') },
        { code: tmpl('<Element fit="{type: cover, position: {x: 0.5}}" />') },
        { code: tmpl('<Element fit="{type: contain, position: {y: 1}}" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element fit="fill" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Element fit="stretch" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: align', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Text align="left" />') },
        { code: tmpl('<Text align="right" />') },
        { code: tmpl('<Text align="center" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Text align="justify" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Text align="start" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })

  test('reactive binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Text :align="$alignment" />') }],
      invalid: [],
    })
  })
})

describe('valid-attribute-value: contain', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Text contain="none" />') },
        { code: tmpl('<Text contain="width" />') },
        { code: tmpl('<Text contain="both" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Text contain="auto" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Text contain="height" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: direction', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Layout direction="horizontal" />') },
        { code: tmpl('<Layout direction="vertical" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Layout direction="row" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Layout direction="column" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: align-items', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Layout align-items="start" />') },
        { code: tmpl('<Layout align-items="center" />') },
        { code: tmpl('<Layout align-items="end" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Layout align-items="stretch" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Layout align-items="flex-start" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: show', () => {
  test('valid values are accepted on all built-in tags', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element show="true" />') },
        { code: tmpl('<Element show="false" />') },
        { code: tmpl('<Text show="true" />') },
        { code: tmpl('<Layout show="false" />') },
        { code: tmpl('<Component show="true" />') },
      ],
      invalid: [],
    })
  })

  test('invalid value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element show="yes" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Text show="1" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: general behaviour', () => {
  test('placement on wrong tag is not double-reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        // placement is not valid on Component — E-130 handles it, this rule stays silent
        { code: tmpl('<Component placement="invalid" />') },
      ],
      invalid: [],
    })
  })

  test('attributes on wrong tag are not double-reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        // align is not valid on Element — E-130 handles it, this rule stays silent
        { code: tmpl('<Element align="invalid" />') },
        // direction is not valid on Text — same
        { code: tmpl('<Text direction="bad" />') },
      ],
      invalid: [],
    })
  })

  test('reports in Blits.Application', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Application({ template: '<Layout direction="row" />' })`,
          errors: [{ messageId: 'enumInvalid' }],
        },
      ],
    })
  })

  test('reports on nested elements', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        {
          code: tmpl('<Element><Text align="justify" /></Element>'),
          errors: [{ messageId: 'enumInvalid' }],
        },
      ],
    })
  })
})

describe('valid-attribute-value: alpha', () => {
  test('values in range are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element alpha="0" />') },
        { code: tmpl('<Element alpha="1" />') },
        { code: tmpl('<Element alpha="0.5" />') },
        { code: tmpl('<Element alpha="0.01" />') },
        { code: tmpl('<Element alpha="0.99" />') },
      ],
      invalid: [],
    })
  })

  test('alpha works on all built-in tags', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element alpha="0.5" />') },
        { code: tmpl('<Text alpha="0.5" />') },
        { code: tmpl('<Layout alpha="0.5" />') },
        { code: tmpl('<RouterView alpha="0.5" />') },
        { code: tmpl('<Component alpha="0.5" />') },
      ],
      invalid: [],
    })
  })

  test('reactive binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element :alpha="$opacity" />') }],
      invalid: [],
    })
  })

  test('dollar-prefixed value is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element alpha="$opacity" />') }],
      invalid: [],
    })
  })

  test('values above 1 are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element alpha="1.5" />'), errors: [{ messageId: 'outOfRange' }] },
        { code: tmpl('<Element alpha="2" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })

  test('values below 0 are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element alpha="-0.1" />'), errors: [{ messageId: 'outOfRange' }] },
        { code: tmpl('<Element alpha="-1" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })

  test('non-numeric values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element alpha="full" />'), errors: [{ messageId: 'outOfRange' }] },
        { code: tmpl('<Element alpha="auto" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })
})

describe('valid-attribute-value: mount', () => {
  test('values in range are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element mount="0" />') },
        { code: tmpl('<Element mount="1" />') },
        { code: tmpl('<Element mount="0.5" />') },
        { code: tmpl('<Element mount="0.25" />') },
      ],
      invalid: [],
    })
  })

  test('valid object keys and values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element mount="{x: 0.5, y: 0}" />') }],
      invalid: [],
    })
  })

  test('reactive binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element :mount="$m" />') }],
      invalid: [],
    })
  })

  test('dollar-prefixed value is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element mount="$mountVal" />') }],
      invalid: [],
    })
  })

  test('values above 1 are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element mount="1.5" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })

  test('values below 0 are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element mount="-0.1" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })

  test('non-numeric values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element mount="center" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })
})

describe('valid-attribute-value: pivot', () => {
  test('values in range are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element pivot="0" />') },
        { code: tmpl('<Element pivot="1" />') },
        { code: tmpl('<Element pivot="0.5" />') },
        { code: tmpl('<Element pivot="0.25" />') },
      ],
      invalid: [],
    })
  })

  test('valid object keys and values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element pivot="{x: 0.5, y: 0.5}" />') }],
      invalid: [],
    })
  })

  test('reactive binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element :pivot="$p" />') }],
      invalid: [],
    })
  })

  test('dollar-prefixed value is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element pivot="$pivotVal" />') }],
      invalid: [],
    })
  })

  test('values above 1 are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element pivot="1.5" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })

  test('values below 0 are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element pivot="-0.1" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })

  test('non-numeric values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element pivot="center" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })
})

describe('valid-attribute-value: placement', () => {
  test('all 6 valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element placement="left" />') },
        { code: tmpl('<Element placement="center" />') },
        { code: tmpl('<Element placement="right" />') },
        { code: tmpl('<Element placement="top" />') },
        { code: tmpl('<Element placement="middle" />') },
        { code: tmpl('<Element placement="bottom" />') },
      ],
      invalid: [],
    })
  })

  test('valid on all supported tags', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element placement="center" />') },
        { code: tmpl('<Text placement="center" />') },
        { code: tmpl('<Layout placement="center" />') },
        { code: tmpl('<RouterView placement="center" />') },
      ],
      invalid: [],
    })
  })

  test('valid object keys and values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element placement="{x: center, y: middle}" />') },
        { code: tmpl('<Element placement="{x: right}" />') },
      ],
      invalid: [],
    })
  })

  test('reactive binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element :placement="$pos" />') }],
      invalid: [],
    })
  })

  test('dollar-prefixed value is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element placement="$pos" />') }],
      invalid: [],
    })
  })

  test('invalid values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element placement="absolute" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Element placement="flex" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Element placement="Centre" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Element placement="start" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })

  test('reports in Blits.Application', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Application({ template: '<Element placement="flex" />' })`,
          errors: [{ messageId: 'enumInvalid' }],
        },
      ],
    })
  })

  test('reports on nested elements', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        {
          code: tmpl('<Element><Text placement="wrong" /></Element>'),
          errors: [{ messageId: 'enumInvalid' }],
        },
      ],
    })
  })
})

describe('valid-attribute-value: numeric (rotation, z, zIndex)', () => {
  test('valid numeric values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element rotation="0" />') },
        { code: tmpl('<Element rotation="90" />') },
        { code: tmpl('<Element rotation="-45" />') },
        { code: tmpl('<Element rotation="33.5" />') },
        { code: tmpl('<Element z="0" />') },
        { code: tmpl('<Element z="-1" />') },
        { code: tmpl('<Element z="10" />') },
      ],
      invalid: [],
    })
  })

  test('non-numeric values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element rotation="90deg" />'), errors: [{ messageId: 'notNumeric' }] },
        { code: tmpl('<Element rotation="auto" />'), errors: [{ messageId: 'notNumeric' }] },
      ],
    })
  })

  test('float value on integer-only attribute is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element z="1.5" />'), errors: [{ messageId: 'notInteger' }] },
        { code: tmpl('<Element zIndex="2.3" />'), errors: [{ messageId: 'notInteger' }] },
      ],
    })
  })
})

describe('valid-attribute-value: numericOrPercent (x, y, w, h)', () => {
  test('valid values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element x="0" />') },
        { code: tmpl('<Element x="100" />') },
        { code: tmpl('<Element x="-50" />') },
        { code: tmpl('<Element x="50%" />') },
        { code: tmpl('<Element x="100%" />') },
        { code: tmpl('<Element y="-10%" />') },
        { code: tmpl('<Element w="50%" />') },
        { code: tmpl('<Element h="1920" />') },
      ],
      invalid: [],
    })
  })

  test('invalid values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element x="auto" />'), errors: [{ messageId: 'notNumericOrPercent' }] },
        { code: tmpl('<Element x="100px" />'), errors: [{ messageId: 'notNumericOrPercent' }] },
        { code: tmpl('<Element y="50 %" />'), errors: [{ messageId: 'notNumericOrPercent' }] },
        { code: tmpl('<Element w="top" />'), errors: [{ messageId: 'notNumericOrPercent' }] },
      ],
    })
  })
})

describe('valid-attribute-value: positive (size)', () => {
  test('valid positive values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Text size="12" />') },
        { code: tmpl('<Text size="32" />') },
        { code: tmpl('<Text size="0.5" />') },
      ],
      invalid: [],
    })
  })

  test('zero and negative values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Text size="0" />'), errors: [{ messageId: 'notPositive' }] },
        { code: tmpl('<Text size="-12" />'), errors: [{ messageId: 'notPositive' }] },
        { code: tmpl('<Text size="large" />'), errors: [{ messageId: 'notPositive' }] },
      ],
    })
  })
})

describe('valid-attribute-value: nonNegative (letterspacing, gap, padding, maxwidth)', () => {
  test('valid non-negative values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Text letterspacing="0" />') },
        { code: tmpl('<Text letterspacing="5" />') },
        { code: tmpl('<Layout gap="20" />') },
        { code: tmpl('<Layout padding="10" />') },
        { code: tmpl('<Text maxwidth="800" />') },
        { code: tmpl('<Text maxwidth="0" />') },
      ],
      invalid: [],
    })
  })

  test('negative values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Text letterspacing="-1" />'), errors: [{ messageId: 'notNonNegative' }] },
        { code: tmpl('<Layout gap="-10" />'), errors: [{ messageId: 'notNonNegative' }] },
        { code: tmpl('<Text maxwidth="-100" />'), errors: [{ messageId: 'notNonNegative' }] },
      ],
    })
  })

  test('non-numeric values are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Text letterspacing="tight" />'), errors: [{ messageId: 'notNonNegative' }] },
        { code: tmpl('<Layout gap="medium" />'), errors: [{ messageId: 'notNonNegative' }] },
      ],
    })
  })

  test('float value on integer-only attribute is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Text maxwidth="1.5" />'), errors: [{ messageId: 'notInteger' }] },
        { code: tmpl('<Text maxlines="2.5" />'), errors: [{ messageId: 'notInteger' }] },
      ],
    })
  })
})

describe('valid-attribute-value: regex (for)', () => {
  test('valid for syntax is accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element for="item in $list" />') },
        { code: tmpl('<Element for="(item, index) in $items" />') },
      ],
      invalid: [],
    })
  })

  test('reactive for binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [{ code: tmpl('<Element :for="item in $list" />') }],
      invalid: [],
    })
  })

  test('invalid for syntax is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element for="item of $list" />'), errors: [{ messageId: 'regexMismatch' }] },
        { code: tmpl('<Element for="item in list" />'), errors: [{ messageId: 'regexMismatch' }] },
      ],
    })
  })
})

describe('valid-attribute-value: object form — mount and pivot', () => {
  test('valid object values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element mount="{x: 0.5, y: 0}" />') },
        { code: tmpl('<Element mount="{x: 0, y: 1}" />') },
        { code: tmpl('<Element mount="{x: 0.5}" />') },
        { code: tmpl('<Element pivot="{x: 0.5, y: 0.5}" />') },
        { code: tmpl('<Element pivot="{y: 1}" />') },
      ],
      invalid: [],
    })
  })

  test('out-of-range property value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element mount="{x: 1.5, y: 0}" />'), errors: [{ messageId: 'outOfRange' }] },
        { code: tmpl('<Element pivot="{x: 0.5, y: -0.1}" />'), errors: [{ messageId: 'outOfRange' }] },
      ],
    })
  })
})

describe('valid-attribute-value: object form — scale', () => {
  test('valid object values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element scale="{x: 1, y: 2}" />') },
        { code: tmpl('<Element scale="{x: 0.5, y: 1}" />') },
      ],
      invalid: [],
    })
  })

  test('zero or negative x/y value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element scale="{x: 0, y: 1}" />'), errors: [{ messageId: 'notPositive' }] },
        { code: tmpl('<Element scale="{x: 1, y: -0.5}" />'), errors: [{ messageId: 'notPositive' }] },
      ],
    })
  })
})

describe('valid-attribute-value: object form — placement', () => {
  test('valid object values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element placement="{x: center, y: bottom}" />') },
        { code: tmpl('<Element placement="{x: right, y: middle}" />') },
      ],
      invalid: [],
    })
  })

  test('invalid enum property is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element placement="{x: invalid, y: middle}" />'), errors: [{ messageId: 'enumInvalid' }] },
        { code: tmpl('<Element placement="{x: center, y: flex}" />'), errors: [{ messageId: 'enumInvalid' }] },
      ],
    })
  })
})

describe('valid-attribute-value: object form — padding', () => {
  test('valid object values are accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Layout padding="{top: 10, bottom: 20}" />') },
        { code: tmpl('<Layout padding="{x: 20, y: 10}" />') },
        { code: tmpl('<Layout padding="{left: 5, right: 5}" />') },
      ],
      invalid: [],
    })
  })

  test('negative property value is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Layout padding="{top: -5, bottom: 10}" />'), errors: [{ messageId: 'notNonNegative' }] },
      ],
    })
  })
})

describe('valid-attribute-value: object form — range', () => {
  test('valid range object is accepted', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element range="{from: 0, to: 10}" />') },
        { code: tmpl('<Element range="{from: 5, to: 20}" />') },
      ],
      invalid: [],
    })
  })

  test('float values in range object are reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element range="{from: 1.5, to: 10}" />'), errors: [{ messageId: 'notInteger' }] },
        { code: tmpl('<Element range="{from: 0, to: 1.5}" />'), errors: [{ messageId: 'notInteger' }] },
      ],
    })
  })
})

describe('valid-attribute-value: object form — unknown keys', () => {
  test('all known keys pass without error', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element color="{top: red, bottom: blue, left: green, right: yellow}" />') },
        { code: tmpl('<Element scale="{x: 1, y: 2}" />') },
        { code: tmpl('<Element mount="{x: 0.5, y: 0}" />') },
        { code: tmpl('<Element pivot="{x: 0.5, y: 0.5}" />') },
        { code: tmpl('<Element placement="{x: center, y: middle}" />') },
        { code: tmpl('<Layout padding="{top: 10, bottom: 20, left: 5, right: 5, x: 10, y: 10}" />') },
        { code: tmpl('<Element range="{from: 0, to: 10}" />') },
        { code: tmpl('<Element src="{src: image.png, type: svg}" />') },
        { code: tmpl('<Element fit="{type: cover, position: 0}" />') },
      ],
      invalid: [],
    })
  })

  test('unknown key in color object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element color="{t: red, b: blue}" />'), errors: [{ messageId: 'unknownObjectKey' }, { messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element color="{top: red, side: yellow}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element color="{gradient: red}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in scale object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element scale="{z: 1}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element scale="{x: 1, z: 1}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in mount object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element mount="{z: 0.5}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element mount="{x: 0.5, z: 0}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in pivot object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element pivot="{h: 0.5, v: 0.5}" />'), errors: [{ messageId: 'unknownObjectKey' }, { messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in placement object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element placement="{horizontal: center}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element placement="{horizontal: center, vertical: top}" />'), errors: [{ messageId: 'unknownObjectKey' }, { messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in padding object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Layout padding="{horizontal: 10}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Layout padding="{top: 10, vertical: 5}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in range object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element range="{start: 0, end: 10}" />'), errors: [{ messageId: 'unknownObjectKey' }, { messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element range="{from: 0, finish: 10}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in src object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element src="{url: image.png}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element src="{src: image.png, format: svg}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key in fit object is reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        { code: tmpl('<Element fit="{mode: cover}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
        { code: tmpl('<Element fit="{type: cover, align: center}" />'), errors: [{ messageId: 'unknownObjectKey' }] },
      ],
    })
  })

  test('unknown key and invalid value both reported', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [],
      invalid: [
        {
          code: tmpl('<Element mount="{x: 1.5, z: 0}" />'),
          errors: [{ messageId: 'outOfRange' }, { messageId: 'unknownObjectKey' }],
        },
        {
          code: tmpl('<Element placement="{x: invalid, horizontal: center}" />'),
          errors: [{ messageId: 'enumInvalid' }, { messageId: 'unknownObjectKey' }],
        },
      ],
    })
  })

  test('inspector-data allows any keys', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element inspector-data="{testId: btn}" />') },
        { code: tmpl('<Element inspector-data="{role: nav, testId: header, anything: foo}" />') },
      ],
      invalid: [],
    })
  })

  test('reactive object binding is not checked', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element :color="{t: $top, b: $bottom}" />') },
        { code: tmpl('<Element :mount="{x: $mx, z: $mz}" />') },
      ],
      invalid: [],
    })
  })

  test('keys inside nested objects are not checked against parent', () => {
    tester.run('valid-attribute-value', rule, {
      valid: [
        { code: tmpl('<Element fit="{type: cover, position: {x: 0, y: 0}}" />') },
        { code: tmpl('<Element fit="{type: cover, position: {x: 0.5, y: 0.5}}" />') },
        { code: tmpl('<Element fit="{type: contain, position: {y: 1}}" />') },
      ],
      invalid: [],
    })
  })
})
