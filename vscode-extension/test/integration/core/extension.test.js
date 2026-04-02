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
const vscode = require('vscode')

const { activateExtension } = require('../../utils/helpers')
const { assertExtensionActive } = require('../../utils/assertions')

suite('Extension Test Suite', () => {
  test('Extension should be present', () => {
    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    assert.ok(extension, 'Extension should be installed')
  })

  test('Extension should activate', async () => {
    const extension = await activateExtension()
    assertExtensionActive(extension)
  })
})
