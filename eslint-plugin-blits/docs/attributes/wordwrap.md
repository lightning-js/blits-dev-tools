# wordwrap

> **DEPRECATED**: The `wordwrap` attribute is deprecated. Use `maxwidth` instead.

Sets the maximum line width in pixels for text wrapping.

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
<!-- valid usage (though deprecated) -->
<Text wordwrap="400" />
<Text wordwrap="800" />
<Text wordwrap="0" />

<!-- reactive usage -->
<Text :wordwrap="$activeWrap" />

<!-- invalid usage -->
<Text wordwrap="-100" /> <!-- negative value not accepted -->
<Text wordwrap="100%" /> <!-- percentage not accepted -->
<Text wordwrap="auto" /> <!-- non-numeric string -->
```

---

## What is not validated

Reactive bindings and dollar-prefixed variables are not validated.

---

## Reference

*Kept in the schema for backwards compatibility. Use `maxwidth` instead — see the [Text bounds documentation](https://lightning-js.github.io/blits/#/essentials/displaying_text).*
