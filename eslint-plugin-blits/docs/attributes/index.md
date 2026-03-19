# Blits Template Attributes

All attributes available in Blits component templates, sourced from `data/template-attributes.json` (v1) and `data/template-attributes.v2.json` (v2).

| Attribute | Used in | Reactive | Types | Version |
|---|---|---|---|---|
| [`$shallow`](./$shallow.md) | all | — | directive: `true`, `false` | Both |
| [`align`](./align.md) | `<Text>` | ✓ | enum: `left`, `right`, `center` | Both |
| [`align-items`](./align-items.md) | `<Layout>` | ✓ | enum: `start`, `center`, `end` | Both |
| [`alpha`](./alpha.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number | Both |
| [`border`](./border.md) | `<Element>` | ✓ | number, object | v2+ |
| [`clipping`](./clipping.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | enum: `true`, `false` | Both |
| [`color`](./color.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | string, object | Both |
| [`contain`](./contain.md) | `<Text>` | ✓ | enum: `none`, `width`, `both` (v1) / `+height` (v2) | Both |
| [`content`](./content.md) | `<Text>` | ✓ | string | Both |
| [`direction`](./direction.md) | `<Layout>` | ✓ | enum: `horizontal`, `vertical` | Both |
| [`effects`](./effects.md) | `<Element>` | ✓ | array | v1 only |
| [`fit`](./fit.md) | `<Element>` | ✓ | enum: `cover`, `contain`, object | Both |
| [`font`](./font.md) | `<Text>` | ✓ | string | Both |
| [`for`](./for.md) | all | ✓ | directive | Both |
| [`gap`](./gap.md) | `<Layout>` | ✓ | number | Both |
| [`h`](./h.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string | Both |
| [`height`](./height.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string (alias for `h`) | Both |
| [`inspector-data`](./inspector-data.md) | all | — | object | Both |
| [`is`](./is.md) | component | — | string | Both |
| [`key`](./key.md) | all | — | string | Both |
| [`letterspacing`](./letterspacing.md) | `<Text>` | ✓ | number | Both |
| [`lineheight`](./lineheight.md) | `<Text>` | ✓ | number | Both |
| [`maxheight`](./maxheight.md) | `<Text>` | ✓ | number | Both |
| [`maxlines`](./maxlines.md) | `<Text>` | ✓ | number | Both |
| [`maxwidth`](./maxwidth.md) | `<Text>` | ✓ | number | Both |
| [`mount`](./mount.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number, object | Both |
| [`overflow`](./overflow.md) | `<Element>`, `<Text>` | ✓ | enum: `true`, `false` | Both |
| [`padding`](./padding.md) | `<Layout>` | ✓ | number, object | Both |
| [`pivot`](./pivot.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number, object | Both |
| [`placement`](./placement.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | enum: `left`, `center`, `right`, `top`, `middle`, `bottom`, object | Both |
| [`range`](./range.md) | all | ✓ | object `{from, to}` | Both |
| [`ref`](./ref.md) | all | — | string | Both |
| [`rotation`](./rotation.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number | Both |
| [`rounded`](./rounded.md) | `<Element>` | ✓ | number, array, object | v2+ |
| [`rtt`](./rtt.md) | `<Element>` | ✓ | enum: `true`, `false` | Both |
| [`scale`](./scale.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number, object | Both |
| [`shader`](./shader.md) | `<Element>` | ✓ | string, object | v2+ |
| [`shadow`](./shadow.md) | `<Element>` | ✓ | object | v2+ |
| [`show`](./show.md) | all | ✓ | directive: `true`, `false` | Both |
| [`size`](./size.md) | `<Text>` | ✓ | number | Both |
| [`slot`](./slot.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | — | string | Both |
| [`src`](./src.md) | `<Element>` | ✓ | string, object | Both |
| [`textoverflow`](./textoverflow.md) | `<Text>` | ✓ | string, enum | Both |
| [`w`](./w.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string | Both |
| [`width`](./width.md) | `<Element>`, `<Text>`, `<RouterView>` | ✓ | number, string (alias for `w`) | Both |
| [`wordwrap`](./wordwrap.md) | `<Text>` | ✓ | number | v1 only |
| [`x`](./x.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number, string | Both |
| [`y`](./y.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>`, component | ✓ | number, string | Both |
| [`z`](./z.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number | Both |
| [`zIndex`](./zIndex.md) | `<Element>`, `<Text>`, `<Layout>`, `<RouterView>` | ✓ | number (alias for `z`) | Both |
| [`@error`](./event-error.md) | `<Element>`, `<Text>` | — | event | Both |
| [`@loaded`](./event-loaded.md) | `<Element>`, `<Text>` | — | event | Both |
| [`@updated`](./event-updated.md) | `<Layout>` | — | event | Both |
