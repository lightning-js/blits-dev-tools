# @lightningjs/eslint-plugin-blits

An ESLint plugin for Blits apps, linting Blits template syntax in JavaScript and TypeScript files.

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

This enables all rules for `.js` and `.ts` files.

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
  ],
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
