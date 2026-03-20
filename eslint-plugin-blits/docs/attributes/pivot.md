# pivot

Sets the pivot point for rotation and scaling. Accepts a single number or an object `{x, y}` with values between 0 and 1. Default `{x: 0.5, y: 0.5}` is the center.

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

**Number** (between 0 and 1 inclusive) or an **object literal** `{x, y}` with numeric values between 0 and 1 inclusive.

---

## Examples

```blits
<!-- valid usage -->
<Element pivot="0.5" /> <!-- center pivot -->
<Element pivot="1" />
<Element pivot="0" />

<!-- object form for specific axes -->
<Element pivot="{x: 0, y: 0}" />
<Element pivot="{x: 1, y: 0.5}" />

<!-- reactive usage -->
<Element :pivot="$activePivot" />

<!-- invalid usage -->
<Element pivot="1.5" /> <!-- restricted to 0-1 range -->
<Element pivot="-0.1" /> <!-- restricted to 0-1 range -->
<Element pivot="top-left" />
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Mount point and pivot point](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "The `pivot` point dictates the origin point from where an Element is rotated (using `rotation`) or rescaled (using `scale`). By default, the `pivot` point is exactly the center of the Element (`0.5`)."
>
> "Similar to the mount point, you can pass a single decimal value between `0` and `1` (for equal x and y), or an object with specific configurations for the x-axis and the y-axis."
