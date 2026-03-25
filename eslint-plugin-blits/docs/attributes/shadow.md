# shadow

Apply a box shadow behind an Element.

**Attribute** · Reactive · **Blits version:** v2+

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |

---

## Accepted values

An object with any combination of the following keys:

| Key | Type | Description |
|---|---|---|
| `x` | number | Horizontal shadow offset in pixels |
| `y` | number | Vertical shadow offset in pixels |
| `blur` | number | Shadow blur radius in pixels |
| `spread` | number | Shadow spread radius in pixels |
| `color` | color string | Shadow color |

---

## Examples

```xml
<!-- basic drop shadow -->
<Element w="200" h="200" shadow="{x: 2, y: 2, blur: 8, color: '#000'}" />

<!-- soft shadow with spread -->
<Element w="200" h="200" shadow="{x: 0, y: 4, blur: 12, spread: 2, color: 'rgba(0,0,0,0.5)'}" />

<!-- blur only -->
<Element w="200" h="200" shadow="{blur: 10}" />

<!-- reactive -->
<Element w="200" h="200" :shadow="$shadowConfig" />
```

---

## Note on shader conflict

`shadow` uses the built-in shader system internally. It cannot be combined with the `shader`
attribute on the same element — using both simultaneously is unsupported.

It can be combined with `rounded` and `border`.

---

## What is not validated

- **Reactive bindings** (`:shadow="$config"`) — value is resolved at runtime
- **`color` key** — accepts any value; color format is not validated

---

## Reference

**Blits docs — [Element attributes — Shaders](https://lightning-js.github.io/blits/#/essentials/element_attributes)**
