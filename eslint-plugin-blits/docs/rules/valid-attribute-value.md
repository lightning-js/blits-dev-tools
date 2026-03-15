# valid-attribute-value

Enforce that static attribute values match the allowed set.

**Recommended:** error

---

## Why

Several Blits attributes only accept a fixed set of string values. Passing an unrecognised value is silently ignored by the renderer, leaving the element in its default state. This rule catches typos and invalid values before they produce invisible bugs at runtime.

---

## Checked attributes

| Attribute | Tag | Valid values |
|---|---|---|
| [\`align\`](../attributes/align.md) | `Text` | `left`, `right`, `center` |
| [\`align-items\`](../attributes/align-items.md) | `Layout` | `start`, `center`, `end` |
| [\`alpha\`](../attributes/alpha.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | 0 to 1 |
| [\`clipping\`](../attributes/clipping.md) | `Element`, `Text`, `RouterView` | `true`, `false` |
| [\`color\`](../attributes/color.md) | `Element`, `Text`, `Layout`, `RouterView` | *regex* |
| [\`contain\`](../attributes/contain.md) | `Text` | `none`, `width`, `both` |
| [\`content\`](../attributes/content.md) | `Text` | *regex* |
| [\`direction\`](../attributes/direction.md) | `Layout` | `horizontal`, `vertical` |
| [\`effects\`](../attributes/effects.md) | `Element` | *regex* |
| [\`fit\`](../attributes/fit.md) | `Element` | `cover`, `contain` |
| [\`font\`](../attributes/font.md) | `Text` | *regex* |
| [\`for\`](../attributes/for.md) | all built-in tags | *regex* |
| [\`gap\`](../attributes/gap.md) | `Layout` | *nonNegative* |
| [\`h\`](../attributes/h.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* |
| [\`height\`](../attributes/height.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* |
| [\`inspector-data\`](../attributes/inspector-data.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *dynamic* |
| [\`is\`](../attributes/is.md) | `Component` | *regex* |
| [\`key\`](../attributes/key.md) | all built-in tags | *dynamic* |
| [\`letterspacing\`](../attributes/letterspacing.md) | `Text` | *nonNegative* |
| [\`lineheight\`](../attributes/lineheight.md) | `Text` | *positive* *(integer)* |
| [\`maxheight\`](../attributes/maxheight.md) | `Text` | *nonNegative* *(integer)* |
| [\`maxlines\`](../attributes/maxlines.md) | `Text` | *positive* *(integer)* |
| [\`maxwidth\`](../attributes/maxwidth.md) | `Text` | *nonNegative* *(integer)* |
| [\`mount\`](../attributes/mount.md) | `Element`, `Text`, `Layout`, `RouterView` | 0 to 1 |
| [\`overflow\`](../attributes/overflow.md) | `Element`, `Text` | `true`, `false` |
| [\`padding\`](../attributes/padding.md) | `Layout` | *nonNegative* |
| [\`placement\`](../attributes/placement.md) | `Element`, `Text`, `Layout`, `RouterView` | `left`, `center`, `right`, `top`, `middle`, `bottom` |
| [\`pivot\`](../attributes/pivot.md) | `Element`, `Text`, `Layout`, `RouterView` | 0 to 1 |
| [\`range\`](../attributes/range.md) | all built-in tags | *dynamic* |
| [\`ref\`](../attributes/ref.md) | all built-in tags | *regex* |
| [\`rotation\`](../attributes/rotation.md) | `Element`, `Text`, `Layout`, `RouterView` | *numeric* |
| [\`rtt\`](../attributes/rtt.md) | `Element` | `true`, `false` |
| [\`scale\`](../attributes/scale.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *positive* |
| [\`show\`](../attributes/show.md) | all built-in tags | `true`, `false` |
| [\`size\`](../attributes/size.md) | `Text` | *positive* |
| [\`src\`](../attributes/src.md) | `Element` | *regex* |
| [\`w\`](../attributes/w.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* |
| [\`width\`](../attributes/width.md) | `Element`, `Text`, `RouterView` | *numericOrPercent* |
| [\`x\`](../attributes/x.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *numericOrPercent* |
| [\`y\`](../attributes/y.md) | `Element`, `Text`, `Layout`, `RouterView`, `Component` | *numericOrPercent* |
| [\`z\`](../attributes/z.md) | `Element`, `Text`, `Layout`, `RouterView` | *numeric* *(integer)* |
| [\`zIndex\`](../attributes/zIndex.md) | `Element`, `Text`, `Layout`, `RouterView` | *numeric* *(integer)* |

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

**Object-form values** are not checked:

```js
// ✓ not checked
Blits.Component('Card', {
  template: '<Element fit="{type: cover, position: 0}" />',
})
```

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
