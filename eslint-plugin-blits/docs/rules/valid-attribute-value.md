# valid-attribute-value

Enforce that static attribute values match the allowed set.

**Recommended:** error

---

## Why

Several Blits attributes only accept a fixed set of string values. Passing an unrecognised value is silently ignored by the renderer, leaving the element in its default state. This rule catches typos and invalid values before they produce invisible bugs at runtime.

---

## Version-aware

This rule loads the attribute schema based on the detected Blits version (`blitsVersion` setting or auto-detected from `package.json`). The checked attribute set differs between v1 and v2 — v2 adds new attributes and removes `effects` and `wordwrap`.

## Checked attributes

| Attribute | Tag | Valid values | Version |
|---|---|---|---|
| [\`$shallow\`](../attributes/$shallow.md) | all built-in tags | `true`, `false` | Both |
| [\`align\`](../attributes/align.md) | `Text` | `left`, `right`, `center` | Both |
| [\`align-items\`](../attributes/align-items.md) | `Layout` | `start`, `center`, `end` | Both |
| [\`alpha\`](../attributes/alpha.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | 0 to 1 | Both |
| [\`border\`](../attributes/border.md) | `Element` | *positive*, object | v2+ |
| [\`clipping\`](../attributes/clipping.md) | `Element`, `Text`, `RouterView` | `true`, `false` | Both |
| [\`color\`](../attributes/color.md) | `Element`, `Text`, `Layout`, `RouterView` | *regex* | Both |
| [\`contain\`](../attributes/contain.md) | `Text` | `none`, `width`, `both` (v1) / `+height` (v2) | Both |
| [\`content\`](../attributes/content.md) | `Text` | *regex* | Both |
| [\`direction\`](../attributes/direction.md) | `Layout` | `horizontal`, `vertical` | Both |
| [\`effects\`](../attributes/effects.md) | `Element` | *regex* | v1 only |
| [\`fit\`](../attributes/fit.md) | `Element` | `cover`, `contain` | Both |
| [\`font\`](../attributes/font.md) | `Text` | *regex* | Both |
| [\`for\`](../attributes/for.md) | all built-in tags | *regex* | Both |
| [\`gap\`](../attributes/gap.md) | `Layout` | *nonNegative* | Both |
| [\`h\`](../attributes/h.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* | Both |
| [\`height\`](../attributes/height.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* | Both |
| [\`inspector-data\`](../attributes/inspector-data.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *dynamic* | Both |
| [\`is\`](../attributes/is.md) | `Component` | *regex* | Both |
| [\`key\`](../attributes/key.md) | all built-in tags | *dynamic* | Both |
| [\`letterspacing\`](../attributes/letterspacing.md) | `Text` | *nonNegative* | Both |
| [\`lineheight\`](../attributes/lineheight.md) | `Text` | *positive* *(integer)* | Both |
| [\`maxheight\`](../attributes/maxheight.md) | `Text` | *nonNegative* *(integer)* | Both |
| [\`maxlines\`](../attributes/maxlines.md) | `Text` | *positive* *(integer)* | Both |
| [\`maxwidth\`](../attributes/maxwidth.md) | `Text` | *nonNegative* *(integer)* | Both |
| [\`mount\`](../attributes/mount.md) | `Element`, `Text`, `Layout`, `RouterView` | 0 to 1 | Both |
| [\`overflow\`](../attributes/overflow.md) | `Element`, `Text` | `true`, `false` | Both |
| [\`padding\`](../attributes/padding.md) | `Layout` | *nonNegative* | Both |
| [\`placement\`](../attributes/placement.md) | `Element`, `Text`, `Layout`, `RouterView` | `left`, `center`, `right`, `top`, `middle`, `bottom` | Both |
| [\`pivot\`](../attributes/pivot.md) | `Element`, `Text`, `Layout`, `RouterView` | 0 to 1 | Both |
| [\`range\`](../attributes/range.md) | all built-in tags | *dynamic* | Both |
| [\`ref\`](../attributes/ref.md) | all built-in tags | *regex* | Both |
| [\`rotation\`](../attributes/rotation.md) | `Element`, `Text`, `Layout`, `RouterView` | *numeric* | Both |
| [\`rounded\`](../attributes/rounded.md) | `Element` | *numeric*, array `[n,n,n,n]`, object | v2+ |
| [\`rtt\`](../attributes/rtt.md) | `Element` | `true`, `false` | Both |
| [\`scale\`](../attributes/scale.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *positive* | Both |
| [\`shader\`](../attributes/shader.md) | `Element` | *regex*, object | v2+ |
| [\`shadow\`](../attributes/shadow.md) | `Element` | object | v2+ |
| [\`show\`](../attributes/show.md) | all built-in tags | `true`, `false` | Both |
| [\`size\`](../attributes/size.md) | `Text` | *positive* | Both |
| [\`src\`](../attributes/src.md) | `Element` | *regex* | Both |
| [\`w\`](../attributes/w.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* | Both |
| [\`width\`](../attributes/width.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* | Both |
| [\`wordwrap\`](../attributes/wordwrap.md) | `Text` | *nonNegative* *(integer)* | v1 only |
| [\`x\`](../attributes/x.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *numericOrPercent* | Both |
| [\`y\`](../attributes/y.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *numericOrPercent* | Both |
| [\`z\`](../attributes/z.md) | `Element`, `Text`, `Layout`, `RouterView` | *numeric* *(integer)* | Both |
| [\`zIndex\`](../attributes/zIndex.md) | `Element`, `Text`, `Layout`, `RouterView` | *numeric* *(integer)* | Both |

---

## Examples

```js
// ✗ error — 'row' is not a valid direction value
Blits.Component('Card', {
  template: '<Layout direction="row" />',
})

// ✗ error — 'justify' is not a valid align value
Blits.Component('Card', {
  template: '<Text align="justify" />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Layout direction="horizontal" />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Text align="center" />',
})
```

---

## What is not checked

**Reactive bindings** are not validated — their value is a runtime expression:

```js
// ✓ not checked
Blits.Component('Card', {
  template: '<Layout :direction="$layoutDir" />',
})
```

**Object-form values** — property names are validated against the allowed set, but property values inside nested objects (e.g. `fit.position`) are not:

```js
// ✓ ok — known keys
Blits.Component('Card', {
  template: '<Element fit="{type: cover, position: 0}" />',
})

// ✗ error — 'mode' is not a valid key for 'fit'
Blits.Component('Card', {
  template: '<Element fit="{mode: cover}" />',
})
```

**`slot`** — value must match a `<Slot ref="...">` definition in the parent component; this cannot be verified at lint time.

**Dollar-prefixed static values** are treated as variable references and skipped:

```js
// ✓ not checked
Blits.Component('Card', {
  template: '<Layout direction="$dir" />',
})
```

---

## Reference

**Blits docs — [Element attributes](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "Blits Elements have a specific set of attributes that can be used. The available attributes are loosely modeled after the properties of a Lightning 3 renderer node."

**Blits docs — [Layout](https://lightning-js.github.io/blits/#/built-in/layout)**

> "The `<Layout>` tag is a special built-in component that automatically positions its children."
