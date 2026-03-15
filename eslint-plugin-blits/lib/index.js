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

const plugin = {
  meta: {
    name: '@lightningjs/eslint-plugin-blits',
    version: '0.3.0',
  },
  processors: {
    blitsFile: require('./processor'),
  },
  rules: {
    'valid-template-syntax': require('./rules/valid-template-syntax'),
    'require-single-root-element': require('./rules/require-single-root-element'),
    'only-valid-attributes-for-tags': require('./rules/only-valid-attributes-for-tags'),
    'valid-attribute-value': require('./rules/valid-attribute-value'),
  },
  configs: {},
}

plugin.configs.recommended = {
  plugins: { '@lightningjs/blits': plugin },
  rules: {
    '@lightningjs/blits/valid-template-syntax': 'error',
    '@lightningjs/blits/require-single-root-element': 'error',
    '@lightningjs/blits/only-valid-attributes-for-tags': 'error',
    '@lightningjs/blits/valid-attribute-value': 'error',
  },
}

module.exports = plugin
