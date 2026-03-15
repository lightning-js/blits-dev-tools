# align

The alignment of the text. Centering and right alignment require `maxwidth` to be set.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**Enum:** `left`, `right`, `center`

---

## Examples

```blits
<!-- valid usage -->
<Text content="Left aligned" align="left" />
<Text content="Centered" align="center" maxwidth="400" />
<Text content="Right aligned" align="right" maxwidth="400" />

<!-- invalid usage -->
<Text content="Justified" align="justify" />
```

---

## Note on maxwidth

When aligning text to the `center` or `right`, the `maxwidth` attribute must also be specified so the renderer knows the boundaries of the text box to align within. This constraint is enforced by the `text-align-requires-maxwidth` rule.

---

## What is not validated

Reactive bindings are not validated by the enum rule:

```blits
<!-- not checked for enum validity -->
<Text content="Dynamic alignment" :align="$userAlignmentPrefs" />
```

---

## Reference

**Blits docs — [Displaying Text](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "`align` - the alignment of the text, can be `left`, `right`, or `center`, defaults to `left`. Centering text and aligning text to the right requires the `maxwidth` attribute to be set as well."
