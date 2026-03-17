# slot

Routes an Element or Component to a named slot in the parent component.

**Attribute** · Static

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

**String** (the slot name). Must be a non-empty string that matches the `ref` attribute of a `<Slot ref="...">` definition in the parent component's template.

---

## Examples

```blits
<!-- Parent component template with named slots -->
<Element>
  <Slot ref="header" />
  <Slot ref="content" />
</Element>
```

```blits
<!-- Child elements routed to named slots -->
<MyLayout>
  <Element slot="header" w="1920" h="100" color="#333333" />
  <Text slot="content" content="Hello World" />
</MyLayout>
```

---

## What is not validated

The plugin cannot verify that the named slot exists in the parent component at lint time — that is a runtime concern. Only the format of the value is checked (non-empty string).

