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

const fs = require('fs')
const path = require('path')

let _detected = null

function detectVersion() {
  if (_detected !== null) return _detected
  try {
    const pkgPath = path.join(process.cwd(), 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const version =
      pkg.dependencies?.['@lightningjs/blits'] ||
      pkg.devDependencies?.['@lightningjs/blits']
    _detected = parseInt(version.replace(/^[^\d]*/, ''), 10) || 2
  } catch {
    _detected = 2
  }
  return _detected
}

function getBlitsVersion(context) {
  const setting = context.settings?.blits?.version
  if (setting === undefined || setting === null || setting === 'detect') {
    return detectVersion()
  }
  return parseInt(setting, 10) || 2
}

module.exports = { getBlitsVersion, _resetDetected: () => (_detected = null) }
