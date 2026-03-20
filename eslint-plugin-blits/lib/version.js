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

// Cache per directory so multi-project workspaces each get their own detection result
const _cache = new Map()

function detectVersion(startDir) {
  if (_cache.has(startDir)) return _cache.get(startDir)
  let dir = startDir
  while (true) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
      const version = pkg.dependencies?.['@lightningjs/blits'] || pkg.devDependencies?.['@lightningjs/blits']
      const detected = version ? parseInt(version.replace(/^[^\d]*/, ''), 10) || 2 : 2
      _cache.set(startDir, detected)
      return detected
    } catch {
      // package.json not found or unreadable at this level, go up
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  _cache.set(startDir, 2)
  return 2
}

function getBlitsVersion(context) {
  const setting = context.settings?.blits?.version
  if (setting === undefined || setting === null || setting === 'detect') {
    const filename = context.filename ?? context.getFilename?.() ?? ''
    const startDir = filename ? path.dirname(filename) : process.cwd()
    return detectVersion(startDir)
  }
  return parseInt(setting, 10) || 2
}

module.exports = { getBlitsVersion, _resetCache: () => _cache.clear() }
