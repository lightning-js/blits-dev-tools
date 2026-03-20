# z

The z-index of the element.

*Note: `zIndex` is a valid alias for `z`.*

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |
| `<Layout>` |  |
| `<RouterView>` |  |

---

## Accepted values

**Number** (must be an integer, can be positive or negative).

---

## Examples

```blits
<!-- valid usage -->
<Element z="10" />
<Element z="-1" />
<Element z="100" />

<!-- reactive usage -->
<Element :z="$dynamicZIndex" />

<!-- invalid usage -->
<Element z="1.5" /> <!-- z-index is semantically integer-only -->
<Element z="auto" />
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Positioning and dimensions](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "Similarly, the z-axis (or z-index) can be set with the `z` attribute."
