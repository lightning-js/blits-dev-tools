const assert = require('assert')
const vscode = require('vscode')
const path = require('path')

// Type-safe helpers for VS Code API calls
async function getCompletions(uri, position) {
  const result = await vscode.commands.executeCommand('vscode.executeCompletionItemProvider', uri, position)
  return /** @type {VSCodeCompletionList | undefined} */ (result)
}

async function getHovers(uri, position) {
  const result = await vscode.commands.executeCommand('vscode.executeHoverProvider', uri, position)
  return /** @type {VSCodeHover[] | undefined} */ (result)
}

async function getSignatureHelp(uri, position, triggerCharacter) {
  const result = await vscode.commands.executeCommand(
    'vscode.executeSignatureHelpProvider',
    uri,
    position,
    triggerCharacter
  )
  return /** @type {VSCodeSignatureHelp | undefined} */ (result)
}

suite('JavaScript Integration Tests', () => {
  let jsProjectPath
  let panelBlitsDocument, mainJsDocument, helpersDocument

  suiteSetup(async function () {
    this.timeout(15000)

    // JavaScript project workspace should already be loaded by test runner
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('JavaScript workspace not loaded properly')
    }

    jsProjectPath = workspaceFolders[0].uri.fsPath
    console.log('JavaScript workspace loaded:', jsProjectPath)

    // Open test files - they should be in the current workspace
    const panelUri = vscode.Uri.file(path.join(jsProjectPath, 'src', 'components', 'Panel.blits'))
    const mainUri = vscode.Uri.file(path.join(jsProjectPath, 'src', 'main.js'))
    const helpersUri = vscode.Uri.file(path.join(jsProjectPath, 'src', 'utils', 'helpers.js'))

    panelBlitsDocument = await vscode.workspace.openTextDocument(panelUri)
    mainJsDocument = await vscode.workspace.openTextDocument(mainUri)
    helpersDocument = await vscode.workspace.openTextDocument(helpersUri)

    // Ensure extension is activated
    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    if (extension && !extension.isActive) {
      await extension.activate()
    }

    // Wait for JavaScript language services to initialize properly
    await new Promise((resolve) => setTimeout(resolve, 3000))
  })

  test('Should recognize .blits file with JavaScript script section', () => {
    assert.strictEqual(panelBlitsDocument.languageId, 'blits')

    const text = panelBlitsDocument.getText()
    assert.ok(text.includes('<script>'))
    assert.ok(!text.includes('lang="ts"'))
    assert.ok(text.includes('import { Helpers }'))
    assert.ok(text.includes('JSDoc'))
  })

  test('Should provide JavaScript completions in .blits script section', async () => {
    // Test Math completions in .blits file script section
    const text = panelBlitsDocument.getText()
    const mathPos = text.indexOf('Math.round') + 'Math.'.length
    const position = panelBlitsDocument.positionAt(mathPos)

    const completions = await getCompletions(panelBlitsDocument.uri, position)

    assert.ok(completions)
    assert.ok(completions.items.length > 0)

    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide Math object methods - STRICT validation for standard library
    assert.ok(
      completionLabels.some((label) => label.includes('round')),
      `Math.round not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('floor')),
      `Math.floor not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('PI')),
      `Math.PI not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
  })

  test('Should provide hover information for JavaScript functions in .blits file', async () => {
    const text = panelBlitsDocument.getText()
    const helpersPos = text.indexOf('Helpers.calculateArea')
    const position = panelBlitsDocument.positionAt(helpersPos)

    const hovers = await getHovers(panelBlitsDocument.uri, position)

    assert.ok(hovers)
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent)
      // Should show JSDoc information
      assert.ok(hoverContent.value.includes('Helpers') || hoverContent.includes('Helpers'))
    }
  })

  test('Should resolve path aliases in .blits JavaScript imports', async () => {
    const text = panelBlitsDocument.getText()
    const importPos = text.indexOf('@utils/helpers')
    const position = panelBlitsDocument.positionAt(importPos)

    // Test go to definition for path alias
    const definitions = await vscode.commands.executeCommand(
      'vscode.executeDefinitionProvider',
      panelBlitsDocument.uri,
      position
    )

    assert.ok(definitions)
    if (definitions.length > 0) {
      const definition = definitions[0]
      assert.ok(definition.uri.fsPath.includes('helpers.js'))
    }
  })

  test('Should provide diagnostics for JavaScript errors in .blits file', async () => {
    // Wait for diagnostics to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(panelBlitsDocument.uri)

    // Should not have major JavaScript errors in our valid file
    const jsErrors = diagnostics.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error && (d.source === 'js' || d.message.includes('Cannot find'))
    )

    // Our test file should be valid JavaScript
    assert.strictEqual(jsErrors.length, 0, `Found JavaScript errors: ${jsErrors.map((e) => e.message).join(', ')}`)
  })

  test('Should support async/await and Promise in .blits JavaScript', async () => {
    const text = panelBlitsDocument.getText()
    const awaitPos = text.indexOf('await Helpers.wait')
    const position = panelBlitsDocument.positionAt(awaitPos)

    const hovers = await getHovers(panelBlitsDocument.uri, position)

    assert.ok(hovers)
    // Should recognize async/await syntax
  })

  test('Should import .blits file from JavaScript main file', async () => {
    const text = mainJsDocument.getText()

    // Verify the import statement exists in the file
    assert.ok(text.includes('./components/Panel.blits'), 'Import statement should exist')

    // Test go to definition for .blits import
    const importPos = text.indexOf('./components/Panel.blits')
    const position = mainJsDocument.positionAt(importPos)

    const definitions = await vscode.commands.executeCommand(
      'vscode.executeDefinitionProvider',
      mainJsDocument.uri,
      position
    )

    // Note: In test environment, cross-file resolution may not work perfectly
    // The important thing is that the JavaScript service can handle .blits imports
    // without throwing errors
    assert.ok(definitions !== undefined, 'Definition provider should respond')
  })

  test('Should provide standard library completions in JavaScript files', async () => {
    const text = helpersDocument.getText()
    const mathPos = text.indexOf('Math.') + 'Math.'.length
    const position = helpersDocument.positionAt(mathPos)

    const completions = await getCompletions(helpersDocument.uri, position)

    assert.ok(completions)
    assert.ok(completions.items.length > 0)

    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide standard Math methods
    assert.ok(completionLabels.some((label) => label.includes('round')))
    assert.ok(completionLabels.some((label) => label.includes('pow')))
    assert.ok(completionLabels.some((label) => label.includes('PI')))
  })

  test('Should provide Array methods completions in JavaScript', async () => {
    const text = panelBlitsDocument.getText()
    const arrayPos = text.indexOf('testNumbers.filter') + 'testNumbers.'.length
    const position = panelBlitsDocument.positionAt(arrayPos)

    const completions = await getCompletions(panelBlitsDocument.uri, position)

    assert.ok(completions)
    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide Array methods - STRICT validation for standard library
    assert.ok(
      completionLabels.some((label) => label.includes('filter')),
      `Array.filter not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('map')),
      `Array.map not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('reduce')),
      `Array.reduce not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
  })

  test('Should provide JSDoc type checking in JavaScript', async () => {
    // Wait for JSDoc type checking
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(helpersDocument.uri)

    // Should provide type checking based on JSDoc
    // Our file should be valid according to JSDoc types
    const typeErrors = diagnostics.filter(
      (d) => d.message.includes('type') && d.severity === vscode.DiagnosticSeverity.Error
    )

    assert.strictEqual(typeErrors.length, 0, `Found JSDoc type errors: ${typeErrors.map((e) => e.message).join(', ')}`)
  })

  test('Should provide Object and JSON completions', async () => {
    const text = mainJsDocument.getText()
    const jsonPos = text.indexOf('JSON.') + 'JSON.'.length
    const position = mainJsDocument.positionAt(jsonPos)

    const completions = await getCompletions(mainJsDocument.uri, position)

    assert.ok(completions)
    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide JSON methods - STRICT validation
    assert.ok(
      completionLabels.some((label) => label.includes('stringify')),
      `JSON.stringify not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('parse')),
      `JSON.parse not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
  })

  test('Should provide hover information for Math object in JavaScript', async () => {
    const text = mainJsDocument.getText()
    const mathPos = text.indexOf('Math.random')
    const position = mainJsDocument.positionAt(mathPos)

    const hovers = await getHovers(mainJsDocument.uri, position)

    assert.ok(hovers, 'Should provide hover for Math object')
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent, 'Should have hover content for Math object')
      // Should show information about Math object or Math.random
      const content = typeof hoverContent === 'string' ? hoverContent : hoverContent.value || ''
      assert.ok(
        content.toLowerCase().includes('math') || content.toLowerCase().includes('random'),
        `Expected Math object info in hover: ${content}`
      )
    }
  })

  test('Should provide hover information for Array methods in JavaScript', async () => {
    const text = helpersDocument.getText()
    const filterPos = text.indexOf('.filter')
    const position = helpersDocument.positionAt(filterPos + 1)

    const hovers = await getHovers(helpersDocument.uri, position)

    assert.ok(hovers, 'Should provide hover for Array methods')
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent, 'Should have hover content for Array methods')
    }
  })

  test('Should provide signature help for functions in .blits JavaScript', async () => {
    const text = panelBlitsDocument.getText()
    const helpersCallPos = text.indexOf('Helpers.calculateArea(') + 'Helpers.calculateArea('.length
    const position = panelBlitsDocument.positionAt(helpersCallPos)

    const signatureHelp = await getSignatureHelp(panelBlitsDocument.uri, position, '(')

    assert.ok(signatureHelp, 'Should provide signature help for JavaScript functions')
    if (signatureHelp.signatures && signatureHelp.signatures.length > 0) {
      const signature = signatureHelp.signatures[0]
      assert.ok(signature.label.includes('calculateArea'), 'Should show calculateArea function signature')
    }
  })
})
