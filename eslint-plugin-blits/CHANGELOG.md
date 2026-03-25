# Changelog

## v1.0.0

Initial release of `@lightningjs/eslint-plugin-blits`.

- `valid-template-syntax` — reports mismatched tags, unclosed attributes, and other parse errors with line/column positions pointing at the exact token
- `require-single-root-element` — errors when a template has more than one root element
- `only-valid-attributes-for-tags` — errors when a built-in tag (`<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, `<Component>`) receives an attribute it doesn't support, using the Blits attribute schema as the source of truth
- `valid-attribute-value` — validates static values against the attribute schema (enums, numeric ranges, positive/non-negative constraints, percentage strings, regex patterns, and object-form values like `{x: 0.5, y: 0}`)
- `configs.recommended` — ESLint 9 flat config preset with all four rules set to `error`
- ESLint 8 supported; rules work but no preset is available
- `docs/attributes/` — reference pages for all 47 Blits template attributes
- Blits v2 support — auto-detects version from `package.json`, loads matching attribute schema. Use `settings: { blits: { version: 2 } }` to pin explicitly
- `border`, `rounded`, `shadow`, `shader` added as v2-only attributes. `effects` and `wordwrap` removed in v2
- `rounded` also accepts array form `[tl, tr, br, bl]` in v2
- `slot` attribute added to schema
- `Layout` added to valid tags for `w`, `h`, `width`, `height`, `clipping`, `overflow`
- `valid-attribute-value` now validates object keys for attributes with a closed key set (`color`, `scale`, `mount`, `pivot`, `fit`, etc.)
- `scale` and `mount` accept any numeric value, `letterspacing` accepts negative values
- `$shallow` no longer triggers a false positive in `valid-template-syntax`
