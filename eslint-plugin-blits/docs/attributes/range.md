# range

Limits a for-loop to render only a subset of items. Accepts an object `{from, to}` where `from` is inclusive and `to` is exclusive. Items outside the range are destroyed and recreated when they re-enter.

**Attribute** · Reactive

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

**Object literal** with `from` (number) and `to` (number).

---

## Examples

```blits
<!-- valid usage -->
<Element :for="item in $items" range="{from: 0, to: 5}" w="100" h="100" />

<!-- reactive usage -->
<Element
  :for="(item, index) in $items"
  :range="{from: $visibleStart, to: $visibleEnd}"
  w="100" h="100"
/>
```

---

## What is not validated

Reactive bindings are not validated by the rule.

---

## Reference

**Blits docs — [For loop - Using the range attribute](https://lightning-js.github.io/blits/#/built-in/for-loop)**

> "Sometimes you may only need to render a portion of an array rather than all the items.
>
> To do this you can use the `range` variable to specify a subset of items to render. You should specify a `from` and `to` value (`from` is inclusive, and `to` is exclusive) inside the `range` variable"
>
> "This works differently to using the `show` directive on the items, as the items will be destroyed once they are outside the range, and created again when they fall back in it."
