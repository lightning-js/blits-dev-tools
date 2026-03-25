# only-valid-attributes-for-tags

Disallow attributes on built-in elements that don't support them.

**Recommended:** error

---

## Why

Blits' built-in tags (`<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, `<Component>`) each support a specific set of attributes. Using an attribute on a tag that doesn't support it has no effect — the renderer silently ignores it. This rule catches those mistakes early and makes clear which attributes belong to which element type.

---

## Version-aware

This rule loads the attribute schema based on the detected Blits version (`blitsVersion` setting or auto-detected from `package.json`). In Blits v2, `effects` and `wordwrap` are removed and `border`, `rounded`, `shadow`, `shader` are added.

## Built-in tags and their attribute sets

| Tag | Purpose | Example-only attributes |
|---|---|---|
| `<Element>` | Base renderer node | `src`, `fit`, `rtt`, `effects` (v1) / `border`, `rounded`, `shadow`, `shader` (v2+) |
| `<Text>` | Text rendering | `content`, `font`, `size`, `align`, `maxwidth`, `wordwrap` (v1 only) |
| `<Layout>` | Auto-layout container | `direction`, `gap`, `align-items`, `padding` |
| `<RouterView>` | Router outlet | — |
| `<Component>` | Dynamic component instantiation (via `is`) | `is` |

Some attributes are universal (`ref`, `show`, `:for`, `key`, `range`, `x`, `y`, `alpha`, etc.) and work on all built-in tags.

---

## Examples

```js
// ✗ error — 'src' is an Element-only attribute
Blits.Component('Card', {
  template: '<Text src="img.png" />',
})

// ✗ error — 'direction' is a Layout-only attribute
Blits.Component('Card', {
  template: '<Element direction="horizontal" />',
})

// ✗ error — 'is' is only valid on the built-in <Component> tag
Blits.Component('Card', {
  template: '<Element is="$comp" />',
})

// ✓ ok — src on Element
Blits.Component('Card', {
  template: '<Element src="img.png" />',
})

// ✓ ok — content on Text
Blits.Component('Card', {
  template: '<Text content="hello" />',
})
```

---

## What is not checked

**User-defined component tags** (PascalCase) are never validated — they accept arbitrary props:

```js
// ✓ not checked — MyCard is a user-defined component
Blits.Component('Foo', {
  template: '<MyCard src="img.png" direction="custom" />',
})
```

**Attributes not listed in the Blits schema** (e.g. custom event handlers like `@tap`, transition modifiers like `.transition`) are ignored:

```js
// ✓ not checked — @tap and .transition are not in the schema
Blits.Component('Foo', {
  template: '<Element @tap="$onTap" .transition="{alpha: {value: 1}}" />',
})
```

---

## Reference

**Blits docs — [Element attributes](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "Blits Elements have a specific set of attributes that can be used."

**Blits docs — [Displaying Text](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "Blits comes with a built-in `<Text>`-tag for displaying and styling texts in a simple and intuitive way."

**Blits docs — [Layout](https://lightning-js.github.io/blits/#/built-in/layout)**

> "The `<Layout>` tag is a special built-in component that automatically positions its children."
