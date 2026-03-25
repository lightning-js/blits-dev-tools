# @lightningjs/eslint-plugin-blits — Rules

ESLint rules for Blits apps. Rules catch template errors, misused attributes, and runtime bugs at lint time — before they reach the TV screen.

---

## Supported Rules

| Rule | Description | Recommended | Fixable |
|---|---|---|---|
| [valid-template-syntax](./rules/valid-template-syntax.md) | Disallow template syntax errors | error | — |
| [require-single-root-element](./rules/require-single-root-element.md) | Enforce exactly one root element in templates | error | — |
| [only-valid-attributes-for-tags](./rules/only-valid-attributes-for-tags.md) | Disallow attributes on built-in tags that don't support them | error | — |
| [valid-attribute-value](./rules/valid-attribute-value.md) | Enforce that static attribute values match the allowed set | error | — |

---

## About

Rules are applied to `Blits.Component()` and `Blits.Application()` call sites. Template strings (both regular string literals and template literals) are parsed and analysed at the attribute level.

`.blits` single-file components are supported via the bundled processor — see the [README](../README.md) for configuration.
