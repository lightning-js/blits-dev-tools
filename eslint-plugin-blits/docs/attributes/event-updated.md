# @updated

Fires after each Layout children update, providing current dimensions (`{w, h}`). Can fire multiple times.

**Event** · Static

---

## Used in

| Tag | |
|---|---|
| `<Layout>` |  |

---

## Accepted values

- **string** (a reference to a component method, e.g. `"$handlerName"`)
- **inline arrow function** (e.g. `"(dimensions, el) => $handlerName(dimensions, el)"`)

---

## Examples

```blits
<!-- valid usage -->
<Layout @updated="$layoutUpdate">
  <Element :w="$width" h="40" color="red" />
</Layout>

<!-- inline arrow function -->
<Layout @updated="(dims) => $onLayoutUpdate(dims)" />
```

```javascript
// Component methods
methods: {
  layoutUpdate(dimensions, el) {
    console.log(`Layout (${el.nodeId}) dimensions updated! Width: ${dimensions.w}, Height: ${dimensions.h}`)
  }
}
```

---

## What is not validated

Event attributes (prefixed with `@`) expect function references or inline arrow functions. This attribute is not currently validated by the `valid-attribute-value` rule because verifying the existence of the referenced method requires cross-component or script-block analysis, and inline arrow functions are arbitrary JavaScript expressions.

---

## Reference

**Blits docs — [Layout - Updated event](https://lightning-js.github.io/blits/#/built-in/layout)**

> "The `<Layout>`-tag automatically updates its dimensions based on the dimensions of its children. After each update in the children, an `updated`-event is emitted on the `<Layout>`-tag. It will receive the current dimensions of the layout.
>
> You can tap into this event by adding an `@updated`-attribute to the `<Layout />`-tag and refer to a method in your Component logic."
