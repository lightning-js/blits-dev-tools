# y

The y position of the Element in pixels (or percentage), relative to its parent - allows negative values and decimals.

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
<Element y="100" />
<Element y="-50" />
<Element y="33.5" />

<!-- valid usage: percentages -->
<Element y="50%" />
<Element y="-10%" />

<!-- reactive usage -->
<Element :y="$dynamicY" />

<!-- invalid usage -->
<Element y="50 %" /> <!-- space before % sign is invalid -->
<Element y="100px" /> <!-- px suffix not accepted -->
<Element y="top" />
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
