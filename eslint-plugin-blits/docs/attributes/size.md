# size

The font size of a Text element in pixels.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**Number** (must be strictly greater than 0).

---

## Examples

```blits
<!-- valid usage -->
<Text size="12" content="Small" />
<Text size="32" content="Normal" />
<Text size="64" content="Large" />

<!-- reactive usage -->
<Text :size="$dynamicSize" content="Dynamic" />

<!-- invalid usage -->
<Text size="0" content="Invisible" /> <!-- zero makes text invisible; must be greater than 0 -->
<Text size="-12" content="Negative" /> <!-- negative font size not accepted -->
<Text size="large" content="String" /> <!-- non-numeric string -->
<Text size="1em" content="Units" /> <!-- em units not accepted -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

**Blits docs — [Displaying text - Specifying the font and size](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "Similarly, the font size can be specified using the `size` attribute. In combination with the `font` family, the exact rendering depends on the specific font characteristics, but generally, the `size` represents pixels."
