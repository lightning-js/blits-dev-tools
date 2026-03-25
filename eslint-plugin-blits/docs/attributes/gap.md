# gap

Controls how much space in pixels is added between each child Element or Component in a Layout.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Layout>` |  |

---

## Accepted values

**Number** (must be 0 or higher).

---

## Examples

```blits
<!-- valid usage -->
<Layout gap="0" />
<Layout gap="10" />
<Layout gap="50" />

<!-- reactive usage -->
<Layout :gap="$layoutSpacing" />

<!-- invalid usage -->
<Layout gap="-10" /> <!-- negative gap not accepted -->
<Layout gap="medium" /> <!-- non-numeric string -->
<Layout gap="10px" /> <!-- px suffix not accepted -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Layout - Spacing between children](https://lightning-js.github.io/blits/#/built-in/layout)**

> "By default, the Layout-component places each Element directly besides (or below) the previous one. By adding the `gap`-attribute, you can control how much space will be added between each Element or Component. The `gap`-attribute accepts a number in pixels."
