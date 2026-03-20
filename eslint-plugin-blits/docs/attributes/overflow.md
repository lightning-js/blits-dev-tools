# overflow

Allows content to extend beyond the element's width and height. Inverse of clipping.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |

---

## Accepted values

**Enum:** `true`, `false`

---

## Examples

```blits
<!-- valid usage -->
<Element w="200" h="200" overflow="false">
  <Element w="300" h="300" color="red" />
</Element>

<!-- invalid usage -->
<Element w="200" h="200" overflow="hidden" />
```

---

## What is not validated

Reactive bindings are not validated by the rule:

```blits
<!-- not checked -->
<Element w="200" h="200" :overflow="$canOverflow" />
```

---

## Reference

**Blits docs — [Element attributes - Clipping / overflow](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "Alternatively you can also use the `overflow`-attribute (and pass it `true` or `false`), which works similar to clipping just mapped inversly (i.e. `overflow=\"false\"` ensures content that surpasses the parent dimensions is clipped-off)."
