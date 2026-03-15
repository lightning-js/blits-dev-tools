# scale

Scales the element. Accepts a single number for uniform scaling or an object `{x, y}` for independent axis scaling. Values below 1 scale down, above 1 scale up.

**Attribute** · Reactive

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

**Number** (must be > 0 in the current ESLint validation schema) or an **object literal** `{x, y}` with numeric values > 0.

---

## Examples

```blits
<!-- valid usage -->
<Element scale="1" />
<Element scale="0.5" />
<Element scale="2" />

<!-- object form for specific axes -->
<Element scale="{x: 1, y: 2}" />
<Element scale="{x: 0.5, y: 1}" />

<!-- reactive usage -->
<Element :scale="$activeScale" />

<!-- invalid usage -->
<Element scale="0" /> <!-- must be > 0 (e.g. 0.001) -->
<Element scale="large" /> <!-- non-numeric string -->
<Element scale="2x" /> <!-- suffix not accepted -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Rotation and scaling](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "With the `scale` attribute you can easily grow or shrink an Element. A value under `1` shrinks the Element, a value over `1` makes it grow."
