# content

The text to be displayed. Can be hardcoded text, a dynamic value, or a reactive value.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**String**, empty string, whitespace, unicode, or numbers as text.

---

## Examples

```blits
<!-- valid usage -->
<Text content="Hello world" />
<Text content="Welcome 🌎" />
<Text content="" />

<!-- reactive usage -->
<Text :content="$dynamicText" />
```

---

## What is not validated

Any string is valid. The schema only checks that the attribute is a non-empty string.

---

## Reference

**Blits docs — [Displaying Text](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "`content` - the text to be displayed. Can be a hardcoded text, a dynamic value, or a reactive value"
