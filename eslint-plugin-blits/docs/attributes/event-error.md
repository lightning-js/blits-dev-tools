# @error

Fires when an image fails to load, passing an error message explaining the failure.

**Event** · Static

---

## Used in

| Tag | |
|---|---|
| `<Element>` | When combined with a `src` attribute |

---

## Accepted values

- **string** (a reference to a component method, e.g. `"$handlerName"`)
- **inline arrow function** (e.g. `"(err) => $handlerName(err)"`)

---

## Examples

```blits
<!-- valid usage -->
<Element src="http://example.com/missing.jpg" @error="$showFallback" />

<!-- inline arrow function -->
<Element src="assets/image.png" @error="(err) => $log.error(err)" />
```

```javascript
// Component methods
methods: {
  showFallback(error) {
    this.$log.error('Image failed to load', error)
    this.showBackupImage()
  }
}
```

---

## What is not validated

Event attributes (prefixed with `@`) expect function references or inline arrow functions. This attribute is not currently validated by the `valid-attribute-value` rule because verifying the existence of the referenced method requires cross-component or script-block analysis, and inline arrow functions are arbitrary JavaScript expressions.

---

## Reference

**Blits docs — [Displaying Images - Asynchronous Loading](https://lightning-js.github.io/blits/#/essentials/displaying_images)**

> "Blits allows you to easily hook into the `loaded` and `error` events of image Elements. You can use this, for example, to only make something visible once an image is fully loaded. Or to display a fallback image when a remote image can't be retrieved."
>
> "the `error` event receives an error message explaining the failure."
