# Blits Template Attributes

All attributes available in Blits component templates, sourced from `data/template-attributes.json`.

| Attribute | Used in | Reactive | Types |
|---|---|---|---|
| [`align`](./align.md) | `<Text>` | ✓ | enum: `left`, `right`, `center` |
| [`align-items`](./align-items.md) | `<Layout>` | ✓ | enum: `start`, `center`, `end` |
| [`alpha`](./alpha.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number |
| [`clipping`](./clipping.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | enum: `true`, `false` |
| [`color`](./color.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | string, object |
| [`contain`](./contain.md) | `<Text>` | ✓ | enum: `none`, `width`, `both` |
| [`content`](./content.md) | `<Text>` | ✓ | string |
| [`direction`](./direction.md) | `<Layout>` | ✓ | enum: `horizontal`, `vertical` |
| [`effects`](./effects.md) | `<Element>` | ✓ | array |
| [`fit`](./fit.md) | `<Element>` | ✓ | enum: `cover`, `contain`, object |
| [`font`](./font.md) | `<Text>` | ✓ | string |
| [`for`](./for.md) | all | ✓ | directive |
| [`gap`](./gap.md) | `<Layout>` | ✓ | number |
| [`h`](./h.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string |
| [`height`](./height.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string (alias for `h`) |
| [`inspector-data`](./inspector-data.md) | all | — | object |
| [`is`](./is.md) | component | — | string |
| [`key`](./key.md) | all | — | string |
| [`letterspacing`](./letterspacing.md) | `<Text>` | ✓ | number |
| [`lineheight`](./lineheight.md) | `<Text>` | ✓ | number |
| [`maxheight`](./maxheight.md) | `<Text>` | ✓ | number |
| [`maxlines`](./maxlines.md) | `<Text>` | ✓ | number |
| [`maxwidth`](./maxwidth.md) | `<Text>` | ✓ | number |
| [`mount`](./mount.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number, object |
| [`overflow`](./overflow.md) | `<Element>`, `<Text>` | ✓ | enum: `true`, `false` |
| [`padding`](./padding.md) | `<Layout>` | ✓ | number, object |
| [`pivot`](./pivot.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number, object |
| [`placement`](./placement.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | enum: `left`, `center`, `right`, `top`, `middle`, `bottom`, object |
| [`range`](./range.md) | all | ✓ | object `{from, to}` |
| [`ref`](./ref.md) | all | — | string |
| [`rotation`](./rotation.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number |
| [`rtt`](./rtt.md) | `<Element>` | ✓ | enum: `true`, `false` |
| [`scale`](./scale.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number, object |
| [`show`](./show.md) | all | ✓ | directive: `true`, `false` |
| [`size`](./size.md) | `<Text>` | ✓ | number |
| [`src`](./src.md) | `<Element>` | ✓ | string, object |
| [`textoverflow`](./textoverflow.md) | `<Text>` | ✓ | string, enum |
| [`w`](./w.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string |
| [`width`](./width.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string (alias for `w`) |
| [`wordwrap`](./wordwrap.md) | `<Text>` | ✓ | number — ⚠️ deprecated, use `maxwidth` |
| [`x`](./x.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number, string |
| [`y`](./y.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number, string |
| [`z`](./z.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number |
| [`zIndex`](./zIndex.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number (alias for `z`) |
| [`@error`](./event-error.md) | `<Element>`, `<Text>` | — | event |
| [`@loaded`](./event-loaded.md) | `<Element>`, `<Text>` | — | event |
| [`@updated`](./event-updated.md) | `<Layout>` | — | event |
