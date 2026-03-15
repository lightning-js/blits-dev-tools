# require-single-root-element

Enforce that Blits component templates have exactly one root element.

**Recommended:** error

---

## Why

The Lightning 3 renderer expects a single root node per component. A template with multiple root elements will not render correctly — only the first element may appear, or the component may fail entirely.

---

## Examples

```js
// ✗ error — two sibling root elements
Blits.Component('Card', {
  template: `
    <Element w="400" h="200" />
    <Text content="Hello" />
  `,
})

// ✓ ok — single root, children nested inside
Blits.Component('Card', {
  template: `
    <Element w="400" h="200">
      <Text content="Hello" />
    </Element>
  `,
})

// ✓ ok — single self-closing root
Blits.Component('Card', {
  template: '<Element w="400" h="200" />',
})
```

---

## Notes

- The error is reported at the second root element, not the first.
- An empty template is valid.
- Fragment tags (`<>...</>`) count as a single root.
- This rule covers only the multiple-root case. Other template parse errors are reported by [`valid-template-syntax`](./valid-template-syntax.md).

---

## Reference

**Blits docs — [Application root](https://lightning-js.github.io/blits/#/essentials/application_root)**

> "You can only have 1 Application component per App."
