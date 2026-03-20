# show

Conditionally shows or hides the Element/Component by setting alpha to 0 or restoring it.

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

**Enum:** `true`, `false`

---

## Examples

```blits
<!-- valid usage -->
<Element w="100" h="100" show="false" />

<!-- reactive usage -->
<Element w="100" h="100" :show="$isActive" />

<!-- invalid usage -->
<Element w="100" h="100" show="1" />
```

---

## What is not validated

Reactive bindings are not validated by the enum rule:

```blits
<!-- not checked for enum validity -->
<!-- passing actual numbers in reactive bindings is permitted by Blits -->
<Element :show="$numberValue" />
```

---

## Reference

**Blits docs — [Directives - Show-directive](https://lightning-js.github.io/blits/#/essentials/directives)**

> "The `show` attribute allows you to conditionally show and hide Components and Elements.
>
> When passed a _truthy_ value, such as `true` or `1`, the element will be made visible. And when passed a _falsey_ value (`false` or `0`) it will not be visible."
