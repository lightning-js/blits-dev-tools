# color

The color of the Element. Accepts hexadecimal, hex with alpha, hex shorthands, RGB, RGBA, HTML color names, or an object with `top`/`bottom`/`left`/`right` keys for linear gradients.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |
| `<Layout>` |  |
| `<RouterView>` |  |

---

## Accepted values

- **hexadecimal** (e.g. `#ff4433`)
- **hexadecimal with alpha channel** (e.g. `#55553380`)
- **hexadecimal shorthands** (e.g. `#333`)
- **rgb** (e.g. `rgb(180, 30, 50)`)
- **rgba** (e.g. `rgba(40, 30, 180, 0.5)`)
- **html color names** (e.g. `red`, `blue`, `skyblue`, `tomato`)
- **object literal** for linear gradients with `top`, `bottom`, `left`, `right` keys (e.g. `{top: 'red', bottom: 'blue'}`)

---

## Examples

```blits
<!-- valid usage -->
<Element w="200" h="200" color="#ff4433" />
<Element w="200" h="200" color="skyblue" />

<!-- linear gradients -->
<Element w="200" h="200" color="{top: 'red', bottom: 'blue'}" />
<Element w="200" h="200" color="{left: 'rgba(255,255,255,.5)', right: '#000'}" />

<!-- invalid usage -->
<Element w="200" h="200" color="red-ish" />
<Element w="200" h="200" color="#GGHHII" />
```

---

## What is not validated

Color values are too varied to enumerate reliably (~140 named colors, hex, rgb, rgba). The schema regex checks structural shape only; specific color correctness is left to the runtime.

---

## Reference

**Blits docs — [Element attributes - Colors](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "By default, Elements have a transparent background color. The `color` attribute can be used to give an Element a color. In Blits, you can specify colors as you are used to in HTML and CSS."

**Blits docs — [Element attributes - Basic linear gradients](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "The color attribute can also be used to specify basic linear gradients. A linear gradient can be defined by specifying an _object literal_ as the `color` attribute instead of a single color."
