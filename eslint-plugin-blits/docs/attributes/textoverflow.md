# textoverflow

The suffix added when text is cropped due to bounds limits. Defaults to `'...'`. Set to `false` or an empty string for no suffix.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Text>` |  |

---

## Accepted values

- **string** (e.g. `'...'`, `'Read more'`)
- **boolean/string enum:** `false`, `''` (empty string)

---

## Examples

```blits
<!-- valid usage -->
<Text content="Very long text" maxwidth="100" textoverflow="..." />
<Text content="Text to clip" maxwidth="100" textoverflow="false" />
<Text content="Text to clip" maxwidth="100" textoverflow="" />

<!-- reactive usage -->
<Text content="Changing text" maxwidth="100" :textoverflow="$suffix" />
```

---

## Note on boundaries

The text overflow functionality is automatically enabled but requires both a horizontal boundary (using `maxwidth`) and a vertical boundary (using `maxlines` or `maxheight`) on the `<Text>` component.

---

## What is not validated

Any string is accepted as a suffix, so the validation schema regex permits any string value. `false` (as a string or boolean) is also explicitly permitted. Reactive bindings are not validated by the rule.

---

## Reference

**Blits docs — [Displaying Text - Text overflow](https://lightning-js.github.io/blits/#/essentials/displaying_text)**

> "`textoverflow` - the suffix to be added when text is cropped due to bounds limits, defaults to `...`"
>
> "The `textoverflow`-attribute itself is not required, unless you want to use another suffix than the standard `...`. If you want _no suffix_ (and just a hard cutoff), the `textoverflow`-attribute should be set to `false` or an _empty string_."
