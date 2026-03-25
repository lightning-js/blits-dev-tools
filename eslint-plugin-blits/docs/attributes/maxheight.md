# maxheight

Maximum height of a text block in pixels. Lines exceeding this height will not be displayed.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**Number** (must be an integer 0 or higher).

---

## Examples

```blits
<!-- valid usage -->
<Text maxheight="100" />
<Text maxheight="400" />
<Text maxheight="1080" />
<Text maxheight="0" />

<!-- reactive usage -->
<Text :maxheight="$activeMaxHeight" />

<!-- invalid usage -->
<Text maxheight="-100" /> <!-- negative value not accepted -->
<Text maxheight="auto" /> <!-- non-numeric string -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Displaying text - Text bounds](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "The `maxheight` attribute behaves much like `maxlines`, but instead of limiting based on the number of lines, it sets a pixel-based height restriction."
