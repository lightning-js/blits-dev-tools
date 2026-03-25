# maxlines

Maximum number of lines that will be displayed.

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
<Text maxlines="1" />
<Text maxlines="3" />
<Text maxlines="10" />
<Text maxlines="0" />

<!-- reactive usage -->
<Text :maxlines="$activeMaxLines" />

<!-- invalid usage -->
<Text maxlines="-1" /> <!-- negative value not accepted -->
<Text maxlines="1.5" /> <!-- line count must be a whole number -->
<Text maxlines="unlimited" /> <!-- non-numeric string -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Displaying text - Text bounds](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "Similarly, the `maxlines` attribute restricts the number of lines a Text-component may occupy. Any text that extends beyond the limit set by `maxwidth` or `maxlines` will be clipped."
