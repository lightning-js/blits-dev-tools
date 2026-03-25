# font

The font family to use for text rendering.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

**String** (name of the registered font).

---

## Examples

```blits
<!-- valid usage -->
<Text content="Hello world" font="sans-serif" />
<Text content="Bolder text" font="raleway" />

<!-- reactive usage -->
<Text content="User name" :font="$userFontSetting" />
```

---

## What is not validated

Font names are registered at launch time in `settings.fonts` and are project-specific. The plugin has no knowledge of which fonts a given app has registered. The validation regex only enforces that the attribute is a non-empty string; it cannot validate against the actual list of registered fonts.

---

## Reference

**Blits docs — [Displaying Text](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "`font` - the font family, defaults to `sans-serif`, or the default font specified in the launch settings"

**Blits docs — [Displaying Text - Using custom fonts](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "The `font`-attribute on the `<Text>`-tag is used to define which font family should be used for a certain piece of text. [...] First, you'll need to place a `.ttf`, `.woff` or `.otf` version of your font in the `public` folder [...] Then you'll need to register the custom font in the Launch settings of your app"
