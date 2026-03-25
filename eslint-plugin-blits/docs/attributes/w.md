# w

The width of the element in pixels or percentage (e.g., "50%"). Allows decimals.

*Note: `width` is a valid alias for `w`.*

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |
| `<RouterView>` |  |

---

## Accepted values

**Number** or **string** (can be a raw number or a percentage).

---

## Examples

```blits
<!-- valid usage: pixels -->
<Element w="400" />
<Element w="1920" />
<Element w="33.5" />

<!-- valid usage: percentages -->
<Element w="50%" />
<Element w="100%" />

<!-- reactive usage -->
<Element :w="$dynamicWidth" />

<!-- invalid usage -->
<Element w="50 %" /> <!-- space before % sign is invalid -->
<Element w="100px" /> <!-- px suffix not accepted -->
<Element w="auto" />
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Positioning and dimensions](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "You can specify the dimensions of an Element by passing the `w` attribute for the width and the `h` attribute for the height."
>
> "Same as with the coordinates, you can pass decimal values, or a percentage."
