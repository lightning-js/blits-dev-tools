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
const path = require('path')
const fs = require('fs')

function loadGrammar(filename) {
  const grammarPath = path.join(__dirname, '../../..', 'syntaxes', filename)
  return JSON.parse(fs.readFileSync(grammarPath, 'utf8'))
}

function getEventPatterns(grammar) {
  // blits.json structure
  if (grammar.repository && grammar.repository['blits-event-attributes']) {
    return grammar.repository['blits-event-attributes'].patterns
  }

  // embedded-html.json structure - patterns are nested inside the second template
  // pattern's tag begin/end block: patterns[1] > patterns (tag) > patterns (attributes)
  const templatePattern = grammar.patterns.find(
    (p) => p.begin && p.begin.includes('template') && p.patterns && p.patterns.length > 0
  )
  if (templatePattern) {
    const tagPattern = templatePattern.patterns.find((p) => p.begin && p.begin.startsWith('(<)'))
    if (tagPattern) {
      return tagPattern.patterns.filter((p) => {
        const source = p.match || p.begin || ''
        return source.includes('@(?:loaded|error|updated)') || source.includes('@(?!loaded')
      })
    }
  }

  throw new Error('Could not find event attribute patterns in grammar')
}

function patternMatches(pattern, testString) {
  if (pattern.match) {
    const regex = new RegExp(pattern.match)
    return regex.test(testString)
  }
  if (pattern.begin) {
    const regex = new RegExp(pattern.begin)
    return regex.test(testString)
  }
  return false
}

function firstMatchingPattern(patterns, testString) {
  for (let i = 0; i < patterns.length; i++) {
    if (patternMatches(patterns[i], testString)) {
      return i
    }
  }
  return -1
}

const validHandlerRefs = [
  '@loaded="$myHandler"',
  '@error="$onError"',
  '@updated="$handleUpdate"',
  '@loaded="$handle.nested"',
  '@loaded="$_private"',
]

const validArrowFunctions = [
  '@loaded="(dims) => $handleLoad(dims)"',
  '@error="() => $onError()"',
  '@updated="(a, b) => $handle(a, b)"',
  '@loaded="(x) => $doSomething(x, 42)"',
]

const invalidHandlerValues = [
  '@loaded="garbage"',
  '@loaded="someFunction()"',
  '@loaded="hello world"',
  '@error="notAHandler"',
  '@updated="random123"',
  '@loaded="console.log(1)"',
]

const invalidEventNames = ['@click="$handleClick"', '@focus="$handleFocus"', '@mouseover="$handler"']

function runGrammarSuite(grammarName, filename) {
  suite(`Event Attribute Grammar Tests (${grammarName})`, () => {
    let patterns

    suiteSetup(() => {
      const grammar = loadGrammar(filename)
      patterns = getEventPatterns(grammar)
    })

    test('Should have 4 event attribute patterns in correct order', () => {
      assert.strictEqual(patterns.length, 4, `Expected 4 event patterns, got ${patterns.length}`)

      assert.ok(patterns[0].match, 'Pattern 0 should be a match pattern')
      assert.ok(patterns[0].match.includes('[$]'), 'Pattern 0 should match $ handler references')

      assert.ok(patterns[1].begin, 'Pattern 1 should be a begin/end pattern')
      assert.ok(patterns[1].begin.includes('=>'), 'Pattern 1 should have => lookahead in begin regex')

      assert.ok(patterns[2].match, 'Pattern 2 should be a match pattern')
      assert.ok(
        patterns[2].captures &&
          (patterns[2].captures['2'].name.includes('invalid.illegal') || patterns[2].name.includes('invalid')),
        'Pattern 2 should scope as invalid.illegal'
      )

      assert.ok(patterns[3].match, 'Pattern 3 should be a match pattern')
      assert.ok(
        patterns[3].name.includes('invalid.illegal'),
        'Pattern 3 should scope invalid event names as invalid.illegal'
      )
    })

    test('$handler references should match Pattern 0', () => {
      for (const input of validHandlerRefs) {
        const idx = firstMatchingPattern(patterns, input)
        assert.strictEqual(idx, 0, `"${input}" should match Pattern 0 ($handler), but matched Pattern ${idx}`)
      }
    })

    test('Arrow functions should match Pattern 1', () => {
      for (const input of validArrowFunctions) {
        const idx = firstMatchingPattern(patterns, input)
        assert.strictEqual(idx, 1, `"${input}" should match Pattern 1 (arrow function), but matched Pattern ${idx}`)
      }
    })

    test('Invalid handler values should match Pattern 2', () => {
      for (const input of invalidHandlerValues) {
        const idx = firstMatchingPattern(patterns, input)
        assert.strictEqual(idx, 2, `"${input}" should match Pattern 2 (invalid catch-all), but matched Pattern ${idx}`)
      }
    })

    test('Arrow function pattern should require => in the value', () => {
      // Ensure the begin regex has a lookahead for =>
      const beginRegex = patterns[1].begin
      assert.ok(
        beginRegex.includes('(?=') && beginRegex.includes('=>'),
        'Arrow function begin pattern must use a lookahead requiring =>'
      )
    })

    test('Arrow function pattern should have correct inner token patterns', () => {
      const innerPatterns = patterns[1].patterns
      assert.ok(innerPatterns, 'Arrow function pattern should have inner patterns')

      const patternNames = innerPatterns.map((p) => p.name)

      assert.ok(
        patternNames.some((n) => n && n.includes('variable.parameter')),
        'Should have variable.parameter pattern for $references'
      )
      assert.ok(
        patternNames.some((n) => n && n.includes('storage.type.function.arrow')),
        'Should have arrow function token pattern for =>'
      )
      assert.ok(
        patternNames.some((n) => n && n.includes('variable.other')),
        'Should have variable.other pattern for identifiers'
      )
      assert.ok(
        patternNames.some((n) => n && n.includes('meta.brace.round')),
        'Should have meta.brace.round pattern for parentheses'
      )
    })

    test('Invalid event names should match Pattern 3', () => {
      for (const input of invalidEventNames) {
        const idx = firstMatchingPattern(patterns, input)
        assert.strictEqual(idx, 3, `"${input}" should match Pattern 3 (invalid event name), but matched Pattern ${idx}`)
      }
    })
  })
}

// Run for both grammar files
runGrammarSuite('blits.json', 'blits.json')
runGrammarSuite('embedded-html.json', 'embedded-html.json')
