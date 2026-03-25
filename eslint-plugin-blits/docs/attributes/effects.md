# effects

Applies one or more shader effects using the `DynamicShader`. Accepts an array of objects, each with a type and optional props.

**Attribute** · Reactive · **Blits version:** v1 only

> **Removed in Blits v2.** The `effects` attribute is not available in Blits v2. Use the `shader`, `border`, `rounded`, or `shadow` attributes instead.

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |

---

## Accepted values

**Array literal** containing objects. Each object must define at minimum a `type` string (e.g. `'radius'`, `'border'`), and may optionally include a `props` object.

---

## Examples

```blits
<!-- valid usage -->
<Element effects="[{type: 'radius', props: {radius: 20}}]" />
<Element effects="[{type: 'border', props: {width: 4, color: '#fff'}}]" />

<!-- multiple effects -->
<Element effects="[{type: 'radius', props: {radius: 10}}, {type: 'border', props: {width: 2, color: '#60a5fa'}}]" />

<!-- complex effects like radial gradient -->
<Element effects="[{type: 'radialGradient', props: {colors: ['#b43fcb', '#6150cb'], pivot: [0.5, 1.1], width: 1920, height: 800}}]" />

<!-- reactive usage -->
<Element :effects="$activeEffects" />
```

---

## What is not validated

The schema only enforces that the attribute contains an array-like structure. Shader types (`radius`, `border`, `radialGradient`, etc.) and their `props` are open-ended, so specific contents are not validated. Reactive bindings are not statically validated.

---

## Reference

*The `effects` attribute (leveraging the `DynamicShader` functionality in the renderer) is currently lightly documented in the official Blits framework documentation but is heavily used throughout the Blits example App and UI components for rounded corners, borders, and gradients.*
