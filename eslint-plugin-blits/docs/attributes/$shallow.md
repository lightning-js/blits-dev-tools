# $shallow

Performance modifier for `:for` loops. Controls whether child components in the loop have access to outer scope variables.

**Directive** · Static only

---

## Used in

| Tag | |
|---|---|
| `<Element>` | |
| `<Text>` | |
| `<Layout>` | |
| `<RouterView>` | |
| `<Component>` | Any user-defined PascalCase component |

Must be used on an element that also has a `:for` attribute.

---

## Accepted values

| Value | Behaviour |
|---|---|
| omitted | Shallow mode — default, fastest |
| `"true"` | Explicit shallow mode — same as omitting |
| `"false"` | Deep mode — outer scope variables accessible inside the loop |

---

## How it works

By default, each item rendered inside a `:for` loop only has access to its own scope (the loop item and index). This is the **shallow** mode and is the most performant option.

Setting `$shallow="false"` switches to **deep** mode: the loop merges the outer component scope into each item's scope using `Object.assign`. This allows expressions inside the loop to reference state, props, or computed values from the parent component directly.

Only use `$shallow="false"` when you genuinely need outer scope access inside the loop. The performance cost comes from the extra `Object.assign` call on every render cycle of the list.

---

## Examples

```blits
<!-- default: shallow mode — loop items only see their own scope -->
<Element :for="item in $items" :w="$item.width" h="80" />

<!-- explicit shallow — same as omitting $shallow -->
<Element :for="item in $items" $shallow="true" :w="$item.width" h="80" />

<!-- deep mode — loop items can reference outer scope ($containerWidth is a state variable) -->
<Element :for="item in $items" $shallow="false" :w="$containerWidth" :color="$item.color" />
```

---

## Reference

*`$shallow` is an internal Blits directive with no public documentation page. It was introduced in Blits v1.3.0 (August 2024). The only external reference is the changelog entry: "Added `$shallow`-modifier to for-loop".*

*Source: `blits/src/lib/codegenerator/generator.js`*
