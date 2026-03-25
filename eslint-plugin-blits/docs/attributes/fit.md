# fit

Controls how an image is resized to fit the Element's dimensions. Accepts 'cover', 'contain', or an object `{type, position}` for fine-grained control over clip position.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |

---

## Accepted values

- **enum:** `cover`, `contain`
- **object literal** with `type` (string: `cover`, `contain`), `position` (number 0-1, or object with `x` and `y` keys 0-1)

---

## Examples

```blits
<!-- valid usage -->
<Element src="assets/bg.jpg" w="1920" h="1080" fit="cover" />
<Element src="assets/logo.png" w="400" h="400" fit="contain" />

<!-- object form for positioning -->
<Element src="assets/hero.jpg" w="1920" h="800" fit="{type: 'cover', position: {y: 0}}" />
<Element src="assets/hero.jpg" w="1920" h="800" fit="{type: 'cover', position: 0.5}" />

<!-- invalid usage -->
<Element src="assets/bg.jpg" w="1920" h="1080" fit="fill" />
```

---

## What is not validated

The object form's `position` key accepts either a plain number (sets both axes) or `{x?, y?}`. Because this nested shape cannot be strictly expressed in the flat description schema without rejecting valid cases, a permissive regex is used for `position`, deferring its correctness to runtime.

Reactive bindings are not validated by the rule.

---

## Reference

**Blits docs — [Displaying Images](https://lightning-js.github.io/blits/#/essentials/displaying_images)**

> The `fit` attribute was added in v1.4.0 to control image resizing behavior.
