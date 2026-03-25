# mount

Sets the mount point of the Element. Accepts a single number or an object `{x, y}` with values between 0 and 1. Default `{x: 0, y: 0}` is the top-left corner.

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

**Number** or an **object literal** `{x, y}` with numeric values. The conventional range is 0 to 1 (where 0 is the start edge and 1 is the end edge), but values outside that range are accepted.

---

## Examples

```blits
<!-- valid usage -->
<Element mount="0.5" /> <!-- sets both mountX and mountY to 0.5 -->
<Element mount="1" />
<Element mount="0" />

<!-- object form for specific axes -->
<Element mount="{x: 0.5, y: 0.8}" />
<Element mount="{x: 0, y: 0}" />
<Element mount="{y: 1}" /> <!-- sets mountY to 1, mountX inherits default 0 -->

<!-- reactive usage -->
<Element :mount="$activeMount" />

<!-- invalid usage -->
<Element mount="center" />
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Element attributes - Mount point and pivot point](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "By default, the `mount` point is set to the `top` and `left` of the Element (`0`). But you can change this using decimal values between `0` and `1`. Setting the `mount` to `0.5`, will place the mount point exactly in the center of the Element."
>
> "Passing a single numeric value sets the mount point for both the x-axis and the y-axis. It is also possible to specify a different mount point for each individual axis by passing an object."
