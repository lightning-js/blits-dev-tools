# src

The image source URL. Can be a string path or an object `{src, type}` where type is `'regular'`, `'svg'`, or `'compressed'` (for cases where file type can't be derived from the file name).

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |

---

## Accepted values

- **string** (the image path or URL)
- **object literal** with `src` (string) and `type` (string: `'regular'`, `'svg'`, `'compressed'`)

---

## Examples

```blits
<!-- valid usage -->
<Element src="assets/logo.png" w="100" h="80" />
<Element src="http://example.com/images/poster.jpg" w="1920" h="1080" />

<!-- object form -->
<Element src="{src: 'assets/icon.compressed', type: 'compressed'}" w="50" h="50" />

<!-- reactive usage -->
<Element :src="$dynamicImageSrc" w="800" h="600" />
```

---

## Note on dimensions

Make sure to give your Element a width (`w`) and a height (`h`) attribute. Images will not be rendered if they don't have both attributes present. This is enforced by the `require-image-dimensions` rule (E-056).

---

## What is not validated

The image source is an open-ended string (URL or path). The validation schema regex only enforces that the attribute is a non-empty string. Object forms are validated to ensure the `type` conforms to the enum of `['regular', 'svg', 'compressed']`. Reactive bindings are not validated by the rule.

---

## Reference

**Blits docs — [Displaying Images](https://lightning-js.github.io/blits/#/essentials/displaying_images)**

> "In Blits, it is very easy to display an image. Simply add the `src` attribute to an Element, specifying the image's location."
>
> "For local images, make sure to place them in the `public` folder of your App (e.g., `public/assets/background.jpg` or `public/images/logo.png`) and refer to them with a _relative_ path (but omitting the `public` folder as root)."
