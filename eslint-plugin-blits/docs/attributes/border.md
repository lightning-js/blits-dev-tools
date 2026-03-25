# border

Apply an inner border to an Element.

**Attribute** · Reactive · **Blits version:** v2+

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |

---

## Accepted values

A number (border width applied to all sides) or an object:

| Key | Type | Description |
|---|---|---|
| `w` | number | Width applied to all sides |
| `top` | number | Top border width |
| `right` | number | Right border width |
| `bottom` | number | Bottom border width |
| `left` | number | Left border width |
| `color` | color string | Border color |

---

## Examples

```xml
<!-- scalar: border width on all sides -->
<Element w="200" h="200" border="10" />

<!-- object: color and uniform width -->
<Element w="200" h="200" border="{w: 4, color: '#60a5fa'}" />

<!-- object: top and bottom only -->
<Element w="200" h="200" border="{top: 2, bottom: 2, color: 'white'}" />

<!-- reactive -->
<Element w="200" h="200" :border="$borderConfig" />
```

---

## Note on shader conflict

`border` uses the built-in shader system internally. It cannot be combined with the `shader`
attribute on the same element — using both simultaneously is unsupported.

It can be combined with `rounded` and `shadow`.

---

## What is not validated

- **Reactive bindings** (`:border="$config"`) — value is resolved at runtime
- **`color` key** — accepts any value; color format is not validated

---

## Reference

**Blits docs — [Element attributes — Shaders](https://lightning-js.github.io/blits/#/essentials/element_attributes)**
