# clipping

Clips child content to the element's width and height boundaries.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |
| `<RouterView>` |  |

---

## Accepted values

**Enum:** `true`, `false`

---

## Examples

```blits
<!-- valid usage -->
<Element w="200" h="200" clipping="true">
  <Element w="300" h="300" color="red" />
</Element>

<!-- invalid usage -->
<Element w="200" h="200" clipping="yes" />
```

---

## What is not validated

Reactive bindings are not validated by the rule:

```blits
<!-- not checked -->
<Element w="200" h="200" :clipping="$isClipping" />
```

---

## Reference

**Blits docs — [Element attributes - Clipping / overflow](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "In order to contain / cut off the content inside an Element's `w` and `h`, you can add the `clipping=\"true\"`-attribute. Setting `clipping` to `false` restores the default behaviour of content overflowing."
