# key

A unique identifier for items in a for-loop, enabling efficient reuse of Element/Component instances when the array changes. Must reference a unique field.

**Attribute** · Static

---

## Used in

| Tag | |
|---|---|
| `<Element>` | When used with `:for` |
| `<Text>` | When used with `:for` |
| `<Layout>` | When used with `:for` |
| `<RouterView>` | When used with `:for` |
| `<Component>` | When used with `:for` |

---

## Accepted values

**String** (typically a reference to a unique property on the loop item, e.g. `"$item.id"`). Note: Do NOT use the loop index as the key.

---

## Examples

```blits
<!-- valid usage -->
<Element :for="item in $items" key="$item.id" w="100" h="100" />
<Poster :for="movie in $movies" key="$movie.hash" />
```

---

## What is not validated

The `key` attribute expects a string reference to a unique property. The validation schema regex only enforces that the attribute contains a non-empty string. The plugin cannot statically verify that the referenced property is actually unique across all items in the array.

---

## Reference

**Blits docs — [For loop - The importance of using the key attribute](https://lightning-js.github.io/blits/#/built-in/for-loop)**

> "For performance reasons, it is essential to be able track the _identity_ of an Element or Component, whenever changes are made to the Array in the for loop."
>
> "Correctly using the `key`-attribute enables Blits to _reuse_ existing instances whenever possible - which obviously is good for performance."
>
> "It's important that the `key`-attribute is _unique_ for each Array item. Also beware that we can't rely on the `index` parameter provided in for loop, because that only identifies the position in the Array, and not the actual item itself."
