# rounded

Round the corners of an Element.

**Attribute** · Reactive · **Blits version:** v2+

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |

---

## Accepted values

**Number** — uniform radius for all corners.

**Array** — four values in order `[top-left, top-right, bottom-right, bottom-left]`.

**Object** — per-corner control:

| Key | Type | Description |
|---|---|---|
| `radius` | number | Radius applied to all corners |
| `top-left` | number | Top-left corner radius |
| `top-right` | number | Top-right corner radius |
| `bottom-right` | number | Bottom-right corner radius |
| `bottom-left` | number | Bottom-left corner radius |

---

## Examples

```xml
<!-- scalar: same radius on all corners -->
<Element w="200" h="200" rounded="20" />

<!-- array: [top-left, top-right, bottom-right, bottom-left] -->
<Element w="200" h="200" rounded="[20, 20, 0, 0]" />

<!-- object: uniform radius -->
<Element w="200" h="200" rounded="{radius: 10}" />

<!-- object: per-corner -->
<Element w="200" h="200" rounded="{top-left: 20, top-right: 20, bottom-right: 0, bottom-left: 0}" />

<!-- reactive -->
<Element w="200" h="200" :rounded="$cornerRadius" />
```

---

## Note on shader conflict

`rounded` uses the built-in shader system internally. It cannot be combined with the `shader`
attribute on the same element — using both simultaneously is unsupported.

It can be combined with `border` and `shadow`.

---

## What is not validated

- **Reactive bindings** (`:rounded="$radius"`) — value is resolved at runtime

---

## Reference

**Blits docs — [Element attributes — Shaders](https://lightning-js.github.io/blits/#/essentials/element_attributes)**
