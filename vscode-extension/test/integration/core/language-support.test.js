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

const { activateExtension } = require('../../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')
const { assertLanguageId } = require('../../utils/assertions')

suite('Language Support Tests', () => {
  let jsDocument, tsDocument, blitsDocument

  suiteSetup(async () => {
    jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    tsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_TS)
    blitsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_BLITS)

    await activateExtension()
  })

  test('JavaScript file should be recognized', () => {
    assertLanguageId(jsDocument, 'javascript')
  })

  test('TypeScript file should be recognized', () => {
    assertLanguageId(tsDocument, 'typescript')
  })

  test('Blits file should be recognized', () => {
    assertLanguageId(blitsDocument, 'blits')
  })
})
