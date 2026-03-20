# contain

The strategy for containing text within bounds. Usually set automatically by Blits based on other specified attributes.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**Enum:** `none`, `width`, `both`

> **Blits v2:** The `height` value is also accepted in Blits v2 — `none`, `width`, `both`, `height`.

---

## Examples

```blits
<!-- valid usage -->
<Text content="Long text..." contain="width" maxwidth="200" />
<Text content="Restricted text" contain="both" maxwidth="200" maxlines="2" />

<!-- invalid usage -->
<Text content="Text" contain="auto" />
```

---

## Note on maxwidth

Setting `contain='width'` without providing a `maxwidth` is a common mistake that prevents the text from actually being contained.

---

## What is not validated

Reactive bindings are not validated by the enum rule:

```blits
<!-- not checked for enum validity -->
<Text content="Dynamic constraints" :contain="$containmentStrategy" />
```

---

## Reference

**Blits docs — [Displaying Text](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "`contain` - the strategy for containing text within the bounds, can be `none` (default), `width`, or `both`. In most cases, the value of this attribute will automatically be set by Blits, based on the other specified attributes"
