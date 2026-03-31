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

const vscode = require('vscode')
const path = require('path')

const FIXTURES_DIR = path.resolve(__dirname, '..', 'fixtures')

function getFixturePath(relativePath) {
  return path.join(FIXTURES_DIR, relativePath)
}

async function openFixtureDocument(relativePath) {
  const uri = vscode.Uri.file(getFixturePath(relativePath))
  return await vscode.workspace.openTextDocument(uri)
}

function getFixtureUri(relativePath) {
  return vscode.Uri.file(getFixturePath(relativePath))
}

const FIXTURES = {
  // Root level fixtures
  TEST_COMPONENT_JS: 'test-component.js',
  TEST_COMPONENT_TS: 'test-component.ts',
  TEST_COMPONENT_BLITS: 'test-component.blits',
  TEST_COMPONENT_WITH_ERRORS: 'test-component-with-errors.js',
  PR_BUG_DEMO_JS: 'pr-bug-demo.js',
  PR_BUG_DEMO_BLITS: 'pr-bug-demo.blits',

  // TypeScript project
  TS_PROJECT: {
    MAIN: 'typescript-project/src/main.ts',
    BUTTON: 'typescript-project/src/components/Button.blits',
    UTILS: 'typescript-project/src/utils/math.ts',
    PACKAGE_JSON: 'typescript-project/package.json',
  },

  // JavaScript project
  JS_PROJECT: {
    MAIN: 'javascript-project/src/main.js',
    PANEL: 'javascript-project/src/components/Panel.blits',
    HELPERS: 'javascript-project/src/utils/helpers.js',
    PACKAGE_JSON: 'javascript-project/package.json',
  },

  // TypeScript v2 project
  TS_V2_PROJECT: {
    MAIN: 'typescript-project-v2/src/main.ts',
  },

  // JavaScript v2 project
  JS_V2_PROJECT: {
    MAIN: 'javascript-project-v2/src/main.js',
  },
}

async function openFixtureDocuments(relativePaths) {
  return Promise.all(relativePaths.map((p) => openFixtureDocument(p)))
}

function getProjectPath(projectName) {
  return path.join(FIXTURES_DIR, projectName)
}

module.exports = {
  FIXTURES_DIR,
  FIXTURES,
  getFixturePath,
  openFixtureDocument,
  openFixtureDocuments,
  getFixtureUri,
  getProjectPath,
}
