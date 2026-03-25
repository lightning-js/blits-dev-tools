# x

The x position of the Element in pixels (or percentage), relative to its parent - allows negative values and decimals.

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

**Number** or **string** (can be a raw number or a percentage).

---

## Examples

```blits
<!-- valid usage: pixels -->
<Element x="100" />
<Element x="-50" />
<Element x="33.5" />

<!-- valid usage: percentages -->
<Element x="50%" />
<Element x="-10%" />

<!-- reactive usage -->
<Element :x="$dynamicX" />

<!-- invalid usage -->
<Element x="50 %" /> <!-- space before % sign is invalid -->
<Element x="100px" /> <!-- px suffix not accepted -->
<Element x="auto" />
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Positioning and dimensions](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "Positioning Elements across the x-axis and the y-axis is done with the `x` and `y` attributes. These attributes accept positive and negative numbers. Decimal values are also allowed."
>
> "In Blits, you can also use percentages as a string for specifying positions."
