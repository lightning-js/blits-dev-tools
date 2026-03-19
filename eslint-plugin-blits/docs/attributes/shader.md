# shader

Apply a custom shader to an Element.

**Attribute** · Reactive · **Blits version:** v2+

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |

---

## Accepted values

A shader name string, or an object with a `type` key and shader-specific props:

```xml
<!-- shader name only (uses default props) -->
<Element shader="rhombus" />

<!-- shader with props -->
<Element shader="{type: 'holePunch', x: 100, y: 200, width: 100, height: 100}" />
```

Available built-in shaders include `linearGradient`, `radialGradient`, and `holePunch`. Custom
imported shaders can also be used.

---

## Note on shader conflict

The `shader` attribute is **mutually exclusive** with the built-in shader attributes (`rounded`,
`border`, `shadow`). Using `shader` alongside any of those on the same element is unsupported —
the built-in attributes use the shader system internally and cannot be mixed with a custom shader.

---

## What is not validated

Shader names and props are open-ended and cannot be statically validated. The ESLint rule does
not check the value of this attribute. Type errors will surface at runtime.

---

## Reference

**Blits docs — [Element attributes — Shaders](https://lightning-js.github.io/blits/#/essentials/element_attributes)**
