# inspector-data

Attaches custom metadata to elements for debugging and automated testing, visible in the Lightning inspector. Only processed in dev mode when inspector is enabled.

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

**Object literal** with any key-value pairs.

---

## Examples

```blits
<!-- valid usage -->
<Element inspector-data="{testId: 'button-primary', role: 'navigation'}" />
<Button inspector-data="{testId: 'submit-button', role: 'action'}" />

<!-- automatic framework data for components -->
<MyComponent /> <!-- exposes data-blits-componenttype in inspector -->
```

---

## What is not validated

Keys and values are user-defined debug metadata with no fixed schema. The object validator has no property rules and does not constrain its contents.

---

## Reference

**Blits docs — [Element attributes - Inspector Data](https://lightning-js.github.io/blits/#/essentials/element_attributes)**

> "The `inspector-data` attribute allows you to attach custom metadata to elements and components for debugging and automated testing. This data is visible in the Lightning inspector tool when enabled."
