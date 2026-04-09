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

const estreePlugin = require('prettier/plugins/estree.js')
const { embed } = require('./embed.js')
const { parse } = require('./blitsParser.js')
const { print } = require('./printer.js')

const builtinEstreePrinter = estreePlugin.printers.estree
const builtinEmbed = builtinEstreePrinter.embed

const options = {
  blitsWrapAttributes: {
    type: 'boolean',
    category: 'Blits',
    default: true,
    description:
      'Wrap element attributes to individual lines when the tag exceeds printWidth. Set to false to keep all attributes inline.',
  },
  blitsClosingBracketSameLine: {
    type: 'boolean',
    category: 'Blits',
    default: false,
    description:
      'Put the closing > of a multi-line opening tag on the same line as the last attribute.',
  },
  blitsPreserveBlankLines: {
    type: 'boolean',
    category: 'Blits',
    default: true,
    description: 'Preserve blank lines between sibling elements. Multiple consecutive blank lines are collapsed to one.',
  },
  blitsTrimAttributeValues: {
    type: 'boolean',
    category: 'Blits',
    default: true,
    description: 'Trim leading/trailing whitespace from attribute values.',
  },
  blitsNormalizeComments: {
    type: 'boolean',
    category: 'Blits',
    default: true,
    description:
      'Normalize comment whitespace — ensures one space after <!-- and before -->. Also collapses triple-dash comments (<!--- ---> → <!-- -->).',
  },
  blitsSelfClosingTags: {
    type: 'boolean',
    category: 'Blits',
    default: false,
    description:
      'Collapse empty open/close tag pairs (<Tag></Tag>) into self-closing form (<Tag />). Disabled by default to preserve developer intent.',
  },
  blitsClosingBacktick: {
    type: 'choice',
    category: 'Blits',
    default: 'newline',
    choices: [
      { value: 'newline', description: 'Closing backtick on its own line.' },
      { value: 'inline', description: 'Closing backtick at the end of the last content line.' },
    ],
    description: 'Position of the closing backtick in multi-line template literals.',
  },
}

module.exports = {
  options,
  parsers: {
    'blits-template': {
      parse,
      astFormat: 'blits-template-ast',
      locStart: (node) => node.start ?? 0,
      locEnd: (node) => node.end ?? 0,
    },
  },
  printers: {
    estree: {
      ...builtinEstreePrinter,
      embed(path, options) {
        const result = embed(path, options)
        if (result !== undefined) return result
        return builtinEmbed?.call(builtinEstreePrinter, path, options)
      },
    },
    'blits-template-ast': {
      print,
    },
  },
}
