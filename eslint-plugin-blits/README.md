# @lightningjs/eslint-plugin-blits

An ESLint plugin for Blits apps, providing linting for `.blits` files and template syntax in JavaScript/TypeScript files.

## Installation

```sh
npm install @lightningjs/eslint-plugin-blits --save-dev
```

## Usage

### ESLint 9 (flat config) — recommended

```js
// eslint.config.js
import blits from '@lightningjs/eslint-plugin-blits'

export default [
  blits.configs.recommended
]
```

This enables all rules for `.js` and `.ts` files. To also lint `.blits` files, add a second entry:

```js
// eslint.config.js
import blits from '@lightningjs/eslint-plugin-blits'

export default [
  blits.configs.recommended,
  {
    files: ['**/*.blits'],
    processor: blits.processors.blitsFile,
  },
]
```

### ESLint 8 (legacy config)

Rules work with ESLint 8 but there is no preset — rules must be enabled manually.

```js
// .eslintrc.js
module.exports = {
  plugins: ['@lightningjs/blits'],
  overrides: [
    {
      files: ['**/*.js', '**/*.ts'],
      rules: {
        '@lightningjs/blits/valid-template-syntax': 'error',
        '@lightningjs/blits/require-single-root-element': 'error',
        '@lightningjs/blits/only-valid-attributes-for-tags': 'error',
        '@lightningjs/blits/valid-attribute-value': 'error',
      },
    },
    {
      files: ['**/*.blits'],
      processor: '@lightningjs/blits/blitsFile',
      rules: {
        '@lightningjs/blits/valid-template-syntax': 'error',
        '@lightningjs/blits/require-single-root-element': 'error',
        '@lightningjs/blits/only-valid-attributes-for-tags': 'error',
        '@lightningjs/blits/valid-attribute-value': 'error',
      },
    },
  ],
}
```

### `.blits` file support in VSCode

After installing the [Lightning Blits](https://marketplace.visualstudio.com/items?itemName=LightningJS.lightning-blits) VSCode extension, add `blits` to `eslint.validate` in your `.vscode/settings.json`:

```json
{
  "eslint.validate": ["javascript", "blits"]
}
```

Or for TypeScript projects:

```json
{
  "eslint.validate": ["typescript", "blits"]
}
```

## Supported Rules

| Rule | Description | Recommended | Fixable |
|---|---|---|---|
| [`valid-template-syntax`](./docs/rules/valid-template-syntax.md) | Disallow template syntax errors (mismatched tags, unclosed attributes, etc.) | error | — |
| [`require-single-root-element`](./docs/rules/require-single-root-element.md) | Enforce that templates have exactly one root element | error | — |
| [`only-valid-attributes-for-tags`](./docs/rules/only-valid-attributes-for-tags.md) | Disallow attributes on built-in elements that don't support them | error | — |
| [`valid-attribute-value`](./docs/rules/valid-attribute-value.md) | Enforce that static attribute values match the allowed set | error | — |

## License

Apache-2.0. See the [LICENSE](LICENSE) file for details.
