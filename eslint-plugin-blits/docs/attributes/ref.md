# ref

A reference identifier for the Element or Component, accessible via `this.$select()` in the component logic.

**Attribute** · Static

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |
| `<Layout>` |  |
| `<RouterView>` |  |
| `<Component>` | Any user-defined PascalCase component |

---

## Accepted values

**String** (the reference identifier).

---

## Examples

```blits
<!-- valid usage -->
<Element w="100" h="100" ref="myElement" />
<Button x="200" ref="submitBtn" />
```

```javascript
// Component methods
methods: {
  focusSubmitButton() {
    const btn = this.$select('submitBtn')
    if (btn) {
      btn.focus()
    }
  }
}
```

---

## What is not validated

The `ref` attribute expects a free-form string identifier, which is not structurally constrained by the `valid-attribute-value` rule.

---

## Reference

**Blits docs — [Directives - Ref-attribute](https://lightning-js.github.io/blits/#/essentials/directives)**

> "For this use case, you can specify a `ref`-attribute on Elements (or Components). And by using the helper function `this.select()`, which is available on every Blits component, you can gain access to the child Element or Component inside your business logic."
