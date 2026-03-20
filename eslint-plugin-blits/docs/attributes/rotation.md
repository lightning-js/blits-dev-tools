# rotation

Rotates the Element. Accepts positive and negative values in degrees.

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

**Number** (can be positive, negative, or decimal). Represents degrees.

---

## Examples

```blits
<!-- valid usage -->
<Element rotation="90" />
<Element rotation="-45" />
<Element rotation="0" />
<Element rotation="33.5" />

<!-- reactive usage -->
<Element :rotation="$dynamicRotation" />

<!-- invalid usage -->
<Element rotation="90deg" /> <!-- deg suffix not accepted -->
<Element rotation="quarter turn" /> <!-- non-numeric string -->
<Element rotation="auto" />
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Rotation and scaling](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "Rotating an Element can be done by specifying a `rotation` attribute. The rotation accepts `positive` and `negative` numbers and denotes the rotation in _degrees_."
