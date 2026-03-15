# direction

Controls the direction of layout content arrangement.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Layout>` |  |

---

## Accepted values

**Enum:** `horizontal`, `vertical`

---

## Examples

```blits
<!-- valid usage -->
<Layout direction="horizontal">
  <Element w="40" h="40" />
</Layout>

<Layout direction="vertical">
  <Element w="40" h="40" />
</Layout>

<!-- invalid usage -->
<Layout direction="row" />
```

---

## What is not validated

Reactive bindings are not validated by the enum rule:

```blits
<!-- not checked for enum validity -->
<Layout :direction="$layoutDirection" />
```

---

## Reference

**Blits docs — [Layout - Horizontal and vertical layout](https://lightning-js.github.io/blits/#/built-in/layout)**

> "By default, the Layout component lays out its contents _horizontally_. The Layout component accepts a `direction` attribute that allows you to control the direction.
>
> In order to align vertically, use `<Layout direction=\"vertical\"></Layout>`. And use `<Layout direction=\"horizontal\"></Layout>` to explicitly apply the default horizontal layout."
