# h

The height of the element in pixels or percentage (e.g., "50%"). Allows decimals.

*Note: `height` is a valid alias for `h`.*

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
<Element h="200" />
<Element h="1080" />
<Element h="33.5" />

<!-- valid usage: percentages -->
<Element h="50%" />
<Element h="100%" />

<!-- reactive usage -->
<Element :h="$dynamicHeight" />

<!-- invalid usage -->
<Element h="50 %" /> <!-- space before % sign is invalid -->
<Element h="100px" /> <!-- px suffix not accepted -->
<Element h="auto" />
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
