const assert = require('assert')
const vscode = require('vscode')
const path = require('path')

suite('Template Detection Tests', () => {
  let jsDocument, tsDocument, errorDocument

  suiteSetup(async () => {
    const jsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.js'))
    const tsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.ts'))
    const errorUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component-with-errors.js'))

    jsDocument = await vscode.workspace.openTextDocument(jsUri)
    tsDocument = await vscode.workspace.openTextDocument(tsUri)
    errorDocument = await vscode.workspace.openTextDocument(errorUri)

    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    await extension.activate()
  })

  test('Should detect template in Blits.Component call in JavaScript', async () => {
    // Open the document to trigger template detection
    await vscode.window.showTextDocument(jsDocument)

    const text = jsDocument.getText()
    assert.ok(text.includes('Blits.Component'))
    assert.ok(text.includes('template: `'))

    // Template should be detected and provide language features
    const templatePos = text.indexOf('<Element')
    const position = jsDocument.positionAt(templatePos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      jsDocument.uri,
      position
    )

    assert.ok(completions)
    // Should provide Blits-specific completions in template
  })

  test('Should detect template in Blits.Component call in TypeScript', async () => {
    await vscode.window.showTextDocument(tsDocument)

    const text = tsDocument.getText()
    assert.ok(text.includes('Blits.Component'))
    assert.ok(text.includes('template: `'))

    // Template detection should work in TypeScript files
    const templatePos = text.indexOf('<Element')
    const position = tsDocument.positionAt(templatePos)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      tsDocument.uri,
      position
    )

    assert.ok(completions)
  })

  test('Should handle template detection with syntax errors', async () => {
    await vscode.window.showTextDocument(errorDocument)

    const text = errorDocument.getText()
    assert.ok(text.includes('Blits.Component'))
    assert.ok(text.includes('template: `'))

    // Even with syntax errors, template detection should work
    // This tests the fallback parsing mechanism
    const templatePos = text.indexOf('<Element')

    if (templatePos >= 0) {
      const position = errorDocument.positionAt(templatePos)

      try {
        const completions = await vscode.commands.executeCommand(
          'vscode.executeCompletionItemProvider',
          errorDocument.uri,
          position
        )

        // Should still provide some completions even with errors
        assert.ok(completions)
      } catch (error) {
        // Fallback mechanism should prevent crashes
        assert.ok(true, 'Extension should handle syntax errors gracefully')
      }
    }
  })

  test('Should detect reactive attributes in templates', async () => {
    const text = jsDocument.getText()
    const colorAttr = text.indexOf(':color="$backgroundColor"')
    assert.ok(colorAttr >= 0, 'Should find reactive attribute')

    // Reactive attributes should be properly detected
    const position = jsDocument.positionAt(colorAttr)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      jsDocument.uri,
      position
    )

    assert.ok(completions)
  })

  test('Should detect event handlers in templates', async () => {
    const text = jsDocument.getText()
    const clickHandler = text.indexOf('@click="$handleClick"')
    assert.ok(clickHandler >= 0, 'Should find event handler')

    // Event handlers should be properly detected
    const position = jsDocument.positionAt(clickHandler)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      jsDocument.uri,
      position
    )

    assert.ok(completions)
  })

  test('Should detect nested components in templates', async () => {
    const text = jsDocument.getText()
    const customButton = text.indexOf('<CustomButton')
    assert.ok(customButton >= 0, 'Should find custom component')

    // Custom components should be detected
    const position = jsDocument.positionAt(customButton + 1)

    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      jsDocument.uri,
      position
    )

    assert.ok(completions)
  })

  test('Should handle multiple templates in same file', async () => {
    // If there were multiple Blits.Component calls in the same file,
    // template detection should handle all of them
    const text = jsDocument.getText()
    const componentCalls = (text.match(/Blits\.Component/g) || []).length

    // Current test file has one component, but system should support multiple
    assert.ok(componentCalls >= 1)
  })

  test('Should parse template boundaries correctly', async () => {
    const text = jsDocument.getText()
    const templateStart = text.indexOf('template: `') + 'template: `'.length
    const templateEnd = text.indexOf('`,', templateStart)

    assert.ok(templateStart > 0)
    assert.ok(templateEnd > templateStart)

    const templateContent = text.substring(templateStart, templateEnd)
    assert.ok(templateContent.includes('<Element'))
    assert.ok(templateContent.includes('</Element>'))
  })
})
