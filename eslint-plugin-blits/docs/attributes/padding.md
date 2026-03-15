# padding

Adds spacing between the content and the edges of the Layout. Accepts a number for uniform padding or an object with top/bottom/left/right/x/y keys.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Layout>` |  |

---

## Accepted values

**Number** or an **object literal** with `top`, `bottom`, `left`, `right`, `x`, `y` keys (all values must be numbers >= 0).

---

## Examples

```blits
<!-- valid usage -->
<Layout padding="10" />
<Layout padding="0" />

<!-- object form for specific sides -->
<Layout padding="{top: 10, bottom: 20}" />
<Layout padding="{x: 20, top: 30, bottom: 10}" />
<Layout padding="{left: 5, right: 5}" />

<!-- reactive usage -->
<Layout :padding="$activePadding" />

<!-- invalid usage -->
<Layout padding="-5" /> <!-- negative padding not accepted -->
<Layout padding="medium" /> <!-- non-numeric string -->
<Layout padding="10px" /> <!-- px suffix not accepted -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Layout - Padding](https://lightning-js.github.io/blits/#/built-in/layout)**

> "By default a `<Layout />`-tag will be resized to the exact dimensions as the content it is containing. The `padding`-attribute can be used to add spacing between the content and the edges of the Layout Component."
>
> "The `padding`-attribute accepts a `number` or an `object`. When passed a number, that padding will be applied equally to all sides. With an object value, the padding can be controlled for each side individually."
