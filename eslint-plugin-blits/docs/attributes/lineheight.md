# lineheight

The spacing between lines in pixels.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**Number** (must be 0 or higher). Decimals are accepted.

---

## Examples

```blits
<!-- valid usage -->
<Text lineheight="0" />
<Text lineheight="20" />
<Text lineheight="40" />
<Text lineheight="1.5" />

<!-- reactive usage -->
<Text :lineheight="$dynamicLineHeight" />

<!-- invalid usage -->
<Text lineheight="-5" /> <!-- negative line height not accepted -->
<Text lineheight="normal" /> <!-- non-numeric string -->
<Text lineheight="1.5em" /> <!-- em units not accepted -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Displaying text - Text formatting](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "Just as with HTML, `lineheight` alters the vertical spacing between individual lines."
