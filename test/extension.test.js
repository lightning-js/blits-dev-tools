const assert = require('assert')
const vscode = require('vscode')
const path = require('path')

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('lightningjs.lightning-blits'))
  })

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    await extension.activate()
    assert.strictEqual(extension.isActive, true)
  })
})

suite('Language Support Tests', () => {
  let jsDocument, tsDocument, blitsDocument

  suiteSetup(async () => {
    // Open test fixture files
    const jsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.js'))
    const tsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.ts'))
    const blitsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.blits'))

    jsDocument = await vscode.workspace.openTextDocument(jsUri)
    tsDocument = await vscode.workspace.openTextDocument(tsUri)
    blitsDocument = await vscode.workspace.openTextDocument(blitsUri)

    // Ensure extension is activated
    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    await extension.activate()
  })

  test('JavaScript file should be recognized', () => {
    assert.strictEqual(jsDocument.languageId, 'javascript')
  })

  test('TypeScript file should be recognized', () => {
    assert.strictEqual(tsDocument.languageId, 'typescript')
  })

  test('Blits file should be recognized', () => {
    assert.strictEqual(blitsDocument.languageId, 'blits')
  })
})

suite('Completion Provider Tests', () => {
  let jsDocument, tsDocument, blitsDocument

  suiteSetup(async () => {
    const jsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.js'))
    const tsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.ts'))
    const blitsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.blits'))

    jsDocument = await vscode.workspace.openTextDocument(jsUri)
    tsDocument = await vscode.workspace.openTextDocument(tsUri)
    blitsDocument = await vscode.workspace.openTextDocument(blitsUri)

    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    await extension.activate()
  })

  test('Should provide completion for Element attributes in JS template', async () => {
    // Find position after "<Element " in template
    const text = jsDocument.getText()
    const elementPos = text.indexOf('<Element ') + '<Element '.length
    const position = jsDocument.positionAt(elementPos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      jsDocument.uri,
      position
    )

    assert.ok(completions)
    assert.ok(completions.items.length > 0)

    // Should include common Element attributes
    const completionLabels = completions.items.map((item) => item.label)
    assert.ok(completionLabels.some((label) => label.includes('w') || label.includes('width')))
    assert.ok(completionLabels.some((label) => label.includes('h') || label.includes('height')))
  })

  // todo: Uncomment when reactive attribute completion is implemented
  // test('Should provide completion for reactive attributes in JS template', async () => {
  //   // Find position after ":color=" in template
  //   const text = jsDocument.getText()
  //   const colorPos = text.indexOf(':color="') + ':color="'.length
  //   const position = jsDocument.positionAt(colorPos)

  //   const completions = await vscode.commands.executeCommand(
  //     'vscode.executeCompletionItemProvider',
  //     jsDocument.uri,
  //     position
  //   )

  //   assert.ok(completions)
  //   // Should suggest state variables with $ prefix
  //   const completionLabels = completions.items.map((item) => item.label)
  //   // Check if reactive attribute completions are available (implementation may vary)
  //   if (completionLabels.some((label) => label.includes('$backgroundColor'))) {
  //     assert.ok(true) // Found expected completion
  //   } else {
  //     // Reactive attribute completion might not be fully implemented yet
  //     console.log('Note: Reactive attribute completion for $backgroundColor not found')
  //     assert.ok(completions.items.length >= 0) // At least basic completions should work
  //   }
  // })

  test('Should provide completion for built-in components', async () => {
    // Find position inside template where we can add a component
    const text = jsDocument.getText()
    const layoutPos = text.indexOf('<Layout') - 1 // Just before <Layout
    const position = jsDocument.positionAt(layoutPos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      jsDocument.uri,
      position
    )

    assert.ok(completions)
    const completionLabels = completions.items.map((item) => item.label)
    assert.ok(completionLabels.some((label) => label.includes('Element')))
    assert.ok(completionLabels.some((label) => label.includes('Text')))
    assert.ok(completionLabels.some((label) => label.includes('Layout')))
    assert.ok(completionLabels.some((label) => label.includes('RouterView')))
  })

  test('Should provide completion in TypeScript template', async () => {
    const text = tsDocument.getText()
    const elementPos = text.indexOf('<Element ') + '<Element '.length
    const position = tsDocument.positionAt(elementPos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      tsDocument.uri,
      position
    )

    assert.ok(completions)
    assert.ok(completions.items.length > 0)
  })

  test('Should provide completion in .blits template section', async () => {
    const text = blitsDocument.getText()
    const elementPos = text.indexOf('<Element ') + '<Element '.length
    const position = blitsDocument.positionAt(elementPos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      blitsDocument.uri,
      position
    )

    assert.ok(completions)
    assert.ok(completions.items.length > 0)
  })

  test('Should provide completion in .blits script section', async () => {
    const text = blitsDocument.getText()
    const statePos = text.indexOf('state()') + 'state()'.length
    const position = blitsDocument.positionAt(statePos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      blitsDocument.uri,
      position
    )

    assert.ok(completions)
    // Should provide JavaScript/TypeScript completions in script section
    assert.ok(completions.items.length > 0)
  })
})
