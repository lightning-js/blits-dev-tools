# align-items

Specifies how to align children on the opposite axis of the Layout direction.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Layout>` |  |

---

## Accepted values

**Enum:** `start`, `center`, `end`

---

## Examples

```blits
<!-- valid usage -->
<Layout direction="horizontal" align-items="center">
  <Element w="40" h="40" />
</Layout>

<Layout direction="vertical" align-items="end">
  <Element w="40" h="40" />
</Layout>

<!-- invalid usage -->
<Layout align-items="bottom" />
```

---

## What is not validated

Reactive bindings are not validated by the enum rule:

```blits
<!-- not checked for enum validity -->
<Layout :align-items="$alignmentPreference" />
```

---

## Reference

**Blits docs — [Layout - Aligning items](https://lightning-js.github.io/blits/#/built-in/layout)**

> "The layout component positions its children based on the provided direction (`horizontal` or `vertical`). With the `align-items`-attribute, you can specify how to align the children on the opposite axis:
>
> - `start` (the default value) - aligns the children at the _top_ for horizontal layouts and on the _left_ for vertical layouts
> - `center` - align the children in the center
> - `end` - aligns the children in the _bottom_ for horizontal layouts, and on the _right_ for vertical layouts"
