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

const assert = require('assert')

const v1Attrs = require('../../src/core/framework/template-attributes.json')
const v2Attrs = require('../../src/core/framework/template-attributes.v2.json')

const { extractBlitsVersion, checkForPrettierPlugin, checkForEslintPlugin } = (() => {
  function extractBlitsVersion(pkg) {
    const raw =
      (pkg.dependencies && pkg.dependencies['@lightningjs/blits']) ||
      (pkg.devDependencies && pkg.devDependencies['@lightningjs/blits'])
    if (!raw) return 2
    if (raw.startsWith('file:')) return 2
    const match = raw.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 2
  }

  function checkForPrettierPlugin(pkg) {
    return !!(
      (pkg.devDependencies && pkg.devDependencies['@lightningjs/prettier-plugin-blits']) ||
      (pkg.dependencies && pkg.dependencies['@lightningjs/prettier-plugin-blits'])
    )
  }

  function checkForEslintPlugin(pkg) {
    return !!(
      (pkg.devDependencies && pkg.devDependencies['@lightningjs/eslint-plugin-blits']) ||
      (pkg.dependencies && pkg.dependencies['@lightningjs/eslint-plugin-blits'])
    )
  }

  return { extractBlitsVersion, checkForPrettierPlugin, checkForEslintPlugin }
})()

suite('workspaceHandler: extractBlitsVersion', () => {
  test('returns 1 for a v1 semver range in dependencies', () => {
    assert.strictEqual(extractBlitsVersion({ dependencies: { '@lightningjs/blits': '^1.20.0' } }), 1)
  })

  test('returns 2 for a v2 semver range in dependencies', () => {
    assert.strictEqual(extractBlitsVersion({ dependencies: { '@lightningjs/blits': '^2.0.0' } }), 2)
  })

  test('returns 2 for a v2 beta range in dependencies', () => {
    assert.strictEqual(extractBlitsVersion({ dependencies: { '@lightningjs/blits': '^2.0.0-beta.1' } }), 2)
  })

  test('reads from devDependencies when not in dependencies', () => {
    assert.strictEqual(extractBlitsVersion({ devDependencies: { '@lightningjs/blits': '^1.48.0' } }), 1)
  })

  test('prefers dependencies over devDependencies', () => {
    assert.strictEqual(
      extractBlitsVersion({
        dependencies: { '@lightningjs/blits': '^2.0.0' },
        devDependencies: { '@lightningjs/blits': '^1.0.0' },
      }),
      2
    )
  })

  test('returns 2 (default) when blits is not listed', () => {
    assert.strictEqual(extractBlitsVersion({ dependencies: {} }), 2)
  })

  test('returns 2 (default) when pkg has no dependency fields', () => {
    assert.strictEqual(extractBlitsVersion({}), 2)
  })

  test('returns 2 (default) for an unparseable version string', () => {
    assert.strictEqual(extractBlitsVersion({ dependencies: { '@lightningjs/blits': 'latest' } }), 2)
  })

  test('returns 2 (default) for a file: path without resolution context', () => {
    assert.strictEqual(extractBlitsVersion({ dependencies: { '@lightningjs/blits': 'file:../blits' } }), 2)
  })
})

suite('workspaceHandler: checkForEslintPlugin', () => {
  test('returns true when present in devDependencies', () => {
    assert.strictEqual(
      checkForEslintPlugin({ devDependencies: { '@lightningjs/eslint-plugin-blits': '^1.0.0' } }),
      true
    )
  })

  test('returns true when present in dependencies', () => {
    assert.strictEqual(checkForEslintPlugin({ dependencies: { '@lightningjs/eslint-plugin-blits': '^1.0.0' } }), true)
  })

  test('returns false when absent', () => {
    assert.strictEqual(checkForEslintPlugin({ devDependencies: {} }), false)
  })

  test('returns false for empty pkg', () => {
    assert.strictEqual(checkForEslintPlugin({}), false)
  })
})

suite('workspaceHandler: checkForPrettierPlugin', () => {
  test('returns true when present in devDependencies', () => {
    assert.strictEqual(
      checkForPrettierPlugin({ devDependencies: { '@lightningjs/prettier-plugin-blits': '^1.0.0' } }),
      true
    )
  })

  test('returns false when absent', () => {
    assert.strictEqual(checkForPrettierPlugin({}), false)
  })
})

suite('bundled v1 attribute data', () => {
  test('contains effects and wordwrap', () => {
    assert.ok('effects' in v1Attrs, 'v1 should have effects')
    assert.ok('wordwrap' in v1Attrs, 'v1 should have wordwrap')
  })

  test('does not contain v2-only attributes', () => {
    assert.ok(!('border' in v1Attrs), 'v1 should not have border')
    assert.ok(!('rounded' in v1Attrs), 'v1 should not have rounded')
    assert.ok(!('shadow' in v1Attrs), 'v1 should not have shadow')
    assert.ok(!('shader' in v1Attrs), 'v1 should not have shader')
  })

  test('contains attributes that were missing from the old bundled file', () => {
    assert.ok('src' in v1Attrs, 'v1 should have src')
    assert.ok('fit' in v1Attrs, 'v1 should have fit')
    assert.ok('rtt' in v1Attrs, 'v1 should have rtt')
    assert.ok('placement' in v1Attrs, 'v1 should have placement')
  })

  test('contain attribute does not include "height" in values', () => {
    const contain = v1Attrs['contain']
    assert.ok(contain, 'contain attribute should exist in v1')
    assert.ok(!contain.values.includes('height'), 'v1 contain should not include "height"')
  })
})

suite('bundled v2 attribute data', () => {
  test('contains v2-only attributes', () => {
    assert.ok('border' in v2Attrs, 'v2 should have border')
    assert.ok('rounded' in v2Attrs, 'v2 should have rounded')
    assert.ok('shadow' in v2Attrs, 'v2 should have shadow')
    assert.ok('shader' in v2Attrs, 'v2 should have shader')
  })

  test('does not contain effects or wordwrap', () => {
    assert.ok(!('effects' in v2Attrs), 'v2 should not have effects')
    assert.ok(!('wordwrap' in v2Attrs), 'v2 should not have wordwrap')
  })

  test('contain attribute includes "height" in values', () => {
    const contain = v2Attrs['contain']
    assert.ok(contain, 'contain attribute should exist in v2')
    assert.ok(contain.values.includes('height'), 'v2 contain should include "height"')
  })

  test('contains common attributes shared with v1', () => {
    assert.ok('src' in v2Attrs, 'v2 should have src')
    assert.ok('fit' in v2Attrs, 'v2 should have fit')
    assert.ok('rtt' in v2Attrs, 'v2 should have rtt')
    assert.ok('placement' in v2Attrs, 'v2 should have placement')
  })
})

suite('getAttributesForComponent filtering by usedIn', () => {
  function filterByComponent(attrs, componentType) {
    return Object.entries(attrs).reduce((acc, [name, def]) => {
      if (def.usedIn.includes(componentType) && def.attrType !== 'event') {
        acc[name] = def
      }
      return acc
    }, {})
  }

  test('v2 Element includes border/rounded and excludes effects', () => {
    const result = filterByComponent(v2Attrs, 'Element')
    assert.ok('border' in result, 'border should be in v2 Element completions')
    assert.ok('rounded' in result, 'rounded should be in v2 Element completions')
    assert.ok(!('effects' in result), 'effects should not be in v2 Element completions')
  })

  test('v1 Element includes effects and excludes border/rounded', () => {
    const result = filterByComponent(v1Attrs, 'Element')
    assert.ok('effects' in result, 'effects should be in v1 Element completions')
    assert.ok(!('border' in result), 'border should not be in v1 Element completions')
    assert.ok(!('rounded' in result), 'rounded should not be in v1 Element completions')
  })

  test('v1 Text includes wordwrap and v2 Text does not', () => {
    const v1Text = filterByComponent(v1Attrs, 'Text')
    assert.ok('wordwrap' in v1Text, 'wordwrap should be in v1 Text completions')

    const v2Text = filterByComponent(v2Attrs, 'Text')
    assert.ok(!('wordwrap' in v2Text), 'wordwrap should not be in v2 Text completions')
  })
})
