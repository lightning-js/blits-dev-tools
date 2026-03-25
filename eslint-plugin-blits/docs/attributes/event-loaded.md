# @loaded

Fires when an image or text element finishes loading and rendering, providing its generated texture dimensions (`{w, h}`).

**Event** · Static

---

## Used in

| Tag | |
|---|---|
| `<Element>` | When combined with a `src` attribute |
| `<Text>` |  |

---

## Accepted values

- **string** (a reference to a component method, e.g. `"$handlerName"`)
- **inline arrow function** (e.g. `"(dimensions) => $handlerName(dimensions)"`)

---

## Examples

```blits
<!-- valid usage for Images -->
<Element src="assets/bg.jpg" @loaded="$handleImageLoaded" />

<!-- valid usage for Text -->
<Text content="Hello world" @loaded="$handleTextLoaded" />

<!-- inline arrow function -->
<Element src="assets/icon.png" @loaded="(dims) => $onLoad(dims)" />
```

```javascript
// Component methods
methods: {
  handleImageLoaded(dimensions) {
    this.$log.info('Image dimensions', dimensions.w, dimensions.h)
    this.show = true
  },
  handleTextLoaded(dimensions) {
    // position an underline matching the exact text width
    this.underlineWidth = dimensions.w
  }
}
```

---

## What is not validated

Event attributes (prefixed with `@`) expect function references or inline arrow functions. This attribute is not currently validated by the `valid-attribute-value` rule because verifying the existence of the referenced method requires cross-component or script-block analysis, and inline arrow functions are arbitrary JavaScript expressions.

---

## Reference

**Blits docs — [Displaying Images - Asynchronous Loading](https://lightning-js.github.io/blits/#/essentials/displaying_images)**

> "All images are loaded asynchronously (and can possibly fail to load), even those local to your App. Blits allows you to easily hook into the `loaded` and `error` events of image Elements."
>
> "The `loaded` event receives image dimensions as its argument"

**Blits docs — [Displaying Text - Text dimensions](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "Similar to the Image element (i.e. an Element with a `src`), Text elements also accept the `@loaded` attribute. This event is called, as soon as the text is rendered, and passes in the dimensions of the generated text texture."
