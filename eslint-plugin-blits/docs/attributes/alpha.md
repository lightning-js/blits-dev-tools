# alpha

Controls the opacity of the element and all its children.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |
| `<Text>` | |
| `<Layout>` | |
| `<RouterView>` | |
| `<Component>` | Any user-defined PascalCase component |

---

## Accepted values

A number between `0` and `1` (inclusive).

| Value | Effect |
|---|---|
| `0` | Fully transparent |
| `0.5` | 50% opacity |
| `1` | Fully opaque (default) |

**Default:** `1`

---

## Examples

```xml
<!-- valid: fully opaque (default) -->
<Element w="200" h="200" color="blue" alpha="1" />

<!-- valid: semi-transparent -->
<Element w="200" h="200" color="blue" alpha="0.8" />

<!-- valid: reactive — not checked by ESLint -->
<Element w="200" h="200" :alpha="$opacity" />

<!-- invalid: above 1 -->
<Element w="200" h="200" alpha="1.5" />

<!-- invalid: non-numeric -->
<Element w="200" h="200" alpha="full" />
```

---

## Important: alpha applies recursively

Setting `alpha` on an element applies to all its children. In this example the inner red element effectively renders at `0.8 × 0.3 = 0.24` opacity:

```xml
<Element w="200" h="200" color="blue" alpha="0.8">
  <Element w="100" h="100" color="red" alpha="0.3" />
</Element>
```

To make only a background semi-transparent without affecting children, set the alpha channel in `color` instead of using the `alpha` attribute.

---

## What is not validated

- **Reactive bindings** (`:alpha="$opacity"`) — value is resolved at runtime, not checked
- **Dollar-prefixed values** (`alpha="$var"`) — treated as a variable reference, not checked

---

## Reference

**Blits docs — [Element attributes — Alpha and visibility](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "The opacity of an Element can be controlled by setting the `alpha` attribute. This attribute accepts a value between `0` (fully transparent) and `1` (completely visible). The value of alpha is also applied recursively to the children of the Element that has its alpha set. If you just want the background color of an Element to be semi-transparent, you should set the alpha channel in the `color` instead of applying the `alpha` attribute."
