# placement

Shorthand for positioning an element relative to its parent's dimensions, without calculating coordinates manually.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |
| `<Text>` | |
| `<Layout>` | |
| `<RouterView>` | |

---

## Accepted values

A single axis value (string) or an object specifying both axes.

**x-axis values**

| Value | Effect |
|---|---|
| `left` | Align to left edge (default) |
| `center` | Center horizontally |
| `right` | Align to right edge |

**y-axis values**

| Value | Effect |
|---|---|
| `top` | Align to top edge (default) |
| `middle` | Center vertically |
| `bottom` | Align to bottom edge |

**Object form** — specify both axes at once: `{x: 'center', y: 'middle'}`

**Default:** none (element uses `x`/`y` coordinates)

---

## Examples

```xml
<Element w="300" h="300">
  <!-- single axis -->
  <Element w="40" h="40" placement="center" />
  <Element w="40" h="40" placement="middle" />
  <Element w="40" h="40" placement="bottom" />

  <!-- both axes via object form — not validated by ESLint -->
  <Element w="40" h="40" placement="{x: 'center', y: 'middle'}" />

  <!-- reactive — not validated -->
  <Element w="40" h="40" :placement="$pos" />

  <!-- invalid: typo -->
  <Element w="40" h="40" placement="Centre" />
</Element>
```

---

## Important: parent must have dimensions

Placement is calculated relative to the direct parent. The parent element must have explicit `w` and `h` attributes — otherwise placement has no reference point and the element won't position correctly.

When `placement` sets an axis, the corresponding `x` or `y` attribute on the same element is ignored for that axis.

---

## What is not validated

- **Object form** (`placement="{x: 'center', y: 'middle'}"`) — too complex to statically validate, skipped
- **Reactive bindings** (`:placement="$pos"`) — value resolved at runtime, not checked
- **Dollar-prefixed values** (`placement="$pos"`) — treated as a variable reference, not checked
- **`<Component>` tags** — placement on a user-defined component is a prop, handled by E-130

---

## Reference

**Blits docs — [Element attributes — Predefined placement options](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "In addition to the absolute positions that Blits and Lightning use, there are a few predefined placement options available. By adding the `placement`-attribute to an Element we can easily align it to the _center_, _left_, _right_, _top_, _bottom_, or even a combination like `{y: 'middle', x: 'left'}`, without having to calculate the positions yourself."

> "The placement of an Element is calculated based on the dimensions of its direct parent. This means that the containing Element _must_ have its own dimensions (i.e. a `w` and a `h` attribute)."
