# for

Directive for repeating multiple instances of an Element or Component based on an array. Uses `item in $array` or `(item, index) in $array` syntax.

**Directive** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |
| `<Text>` |  |
| `<Layout>` |  |
| `<RouterView>` |  |
| `<Component>` | Any user-defined PascalCase component |

---

## Accepted values

**String** (the iteration expression).

---

## Examples

```blits
<!-- valid usage -->
<Element :for="item in $items" w="100" h="100" />
<Element :for="(item, index) in $items" :x="$index * 150" w="100" h="100" />

<!-- referencing array items and index -->
<Text :for="(user, i) in $users" :content="$user.name" :y="$i * 50" />
```

---

## Note on performance and keys

When using a for-loop, also provide a `key` attribute. This lets Blits track element identity and update only what changed, rather than tearing down and recreating the whole list.

---

## What is not validated

The iteration expression (e.g., `item in $items`) is parsed and evaluated by the Blits template compiler. The validation schema regex only enforces that the attribute contains a non-empty string. It does not validate the syntax of the expression itself.

---

## Reference

**Blits docs — [For loop](https://lightning-js.github.io/blits/#/built-in/for-loop)**

> "The for loop takes an `Array` of data, loops over it and for each Array-item an Element or Component is created. The `Array` can be a fixed one, but it can also dynamically be filled or modified and have it's changes reflect in the rendered result."
>
> "The for-loop directive should be added as an attribute on the Element or Component that you want to repeat for each item in your Array. In the template syntax a `for ... in` construct is used."
