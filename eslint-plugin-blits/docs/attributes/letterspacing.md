# letterspacing

Letter spacing in pixels. Allows any number greater than or equal to zero.

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
<Text letterspacing="0" />
<Text letterspacing="1" />
<Text letterspacing="5" />
<Text letterspacing="0.5" />

<!-- reactive usage -->
<Text :letterspacing="$dynamicSpacing" />

<!-- invalid usage -->
<Text letterspacing="-1" /> <!-- negative letter spacing not accepted -->
<Text letterspacing="tight" /> <!-- non-numeric string -->
<Text letterspacing="normal" /> <!-- non-numeric string -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Displaying text - Text formatting](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "Additionally, you can control the `letterspacing` parameter to manipulate the distance between each letter."
