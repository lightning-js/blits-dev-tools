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

const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const fs = require('fs')

const { getBlitsVersion, _resetDetected } = require('../lib/version')

function ctx(version) {
  if (version === undefined) return { settings: {} }
  return { settings: { blits: { version } } }
}

describe('getBlitsVersion', () => {
  beforeEach(() => _resetDetected())

  describe('explicit settings', () => {
    test('returns 1 when set to 1', () => {
      assert.equal(getBlitsVersion(ctx(1)), 1)
    })

    test('returns 2 when set to 2', () => {
      assert.equal(getBlitsVersion(ctx(2)), 2)
    })

    test('returns 1 when set to string "1"', () => {
      assert.equal(getBlitsVersion(ctx('1')), 1)
    })

    test('returns 2 when set to string "2"', () => {
      assert.equal(getBlitsVersion(ctx('2')), 2)
    })

    test('returns 2 when set to "detect"', () => {
      // "detect" falls through to auto-detection; blits not installed here so falls back to 2
      assert.equal(getBlitsVersion(ctx('detect')), 2)
    })
  })

  describe('missing or null settings', () => {
    test('falls back to 2 when settings.blits is absent', () => {
      assert.equal(getBlitsVersion(ctx(undefined)), 2)
    })

    test('falls back to 2 when settings.blits.version is null', () => {
      assert.equal(getBlitsVersion({ settings: { blits: { version: null } } }), 2)
    })

    test('falls back to 2 when settings is absent entirely', () => {
      assert.equal(getBlitsVersion({}), 2)
    })
  })

  describe('auto-detection', () => {
    function withFakeProject(pkg, fn) {
      const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'blits-test-'))
      fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkg))
      const origCwd = process.cwd()
      process.chdir(tmpDir)
      _resetDetected()
      try {
        fn()
      } finally {
        process.chdir(origCwd)
        fs.rmSync(tmpDir, { recursive: true })
        _resetDetected()
      }
    }

    test('detects v2 from a beta version range in dependencies', () => {
      withFakeProject(
        { dependencies: { '@lightningjs/blits': '^2.0.0-beta.10' } },
        () => assert.equal(getBlitsVersion(ctx(undefined)), 2)
      )
    })

    test('detects v2 from a stable v2 version string', () => {
      withFakeProject(
        { dependencies: { '@lightningjs/blits': '2.0.0' } },
        () => assert.equal(getBlitsVersion(ctx(undefined)), 2)
      )
    })

    test('detects v1 from a stable v1 version range', () => {
      withFakeProject(
        { dependencies: { '@lightningjs/blits': '^1.51.0' } },
        () => assert.equal(getBlitsVersion(ctx(undefined)), 1)
      )
    })

    test('detects from devDependencies when not in dependencies', () => {
      withFakeProject(
        { devDependencies: { '@lightningjs/blits': '^2.0.0-beta.10' } },
        () => assert.equal(getBlitsVersion(ctx(undefined)), 2)
      )
    })

    test('falls back to 2 when blits is not listed in package.json', () => {
      withFakeProject(
        { dependencies: {} },
        () => assert.equal(getBlitsVersion(ctx(undefined)), 2)
      )
    })

    test('falls back to 2 when package.json does not exist', () => {
      const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'blits-test-'))
      const origCwd = process.cwd()
      process.chdir(tmpDir)
      _resetDetected()
      try {
        assert.equal(getBlitsVersion(ctx(undefined)), 2)
      } finally {
        process.chdir(origCwd)
        fs.rmSync(tmpDir, { recursive: true })
        _resetDetected()
      }
    })
  })
})
