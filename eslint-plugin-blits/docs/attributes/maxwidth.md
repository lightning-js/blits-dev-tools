# maxwidth

The maximum length of a line of text in pixels. Words surpassing this length will be wrapped onto the next line.

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
<Text maxwidth="0" />
<Text maxwidth="400" />
<Text maxwidth="800" />
<Text maxwidth="1920" />

<!-- reactive usage -->
<Text :maxwidth="$dynamicMaxWidth" />

<!-- invalid usage -->
<Text maxwidth="-100" /> <!-- negative value not accepted -->
<Text maxwidth="100%" /> <!-- percentage not accepted -->
<Text maxwidth="auto" /> <!-- non-numeric string -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Displaying text - Text bounds](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "By default, text is rendered on a single line. However, specifying a `maxwidth` effectively introduces word wrapping to our component."
