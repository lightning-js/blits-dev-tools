# valid-template-syntax

Disallow template syntax errors in Blits component templates.

**Recommended:** error

---

## Why

Blits templates are parsed at runtime. Structural errors — mismatched tags, unclosed attributes, duplicate attributes — cause the component to fail silently or crash the app. This rule catches them at lint time.

---

## What is checked

| Error | Description |
|---|---|
| Mismatched tag pair | Opening and closing tags don't match |
| Unmatched closing tag | Closing tag with no corresponding opening tag |
| Self-closing closing tag | `</Element />` — closing tags cannot be self-closing |
| Attributes on closing tag | `</Element color="red">` — closing tags cannot have attributes |
| Redundant attribute | Same attribute defined twice on the same element |
| Missing attribute value | Attribute with no `="value"` |
| Unclosed attribute value | Opening quote with no closing quote |
| Missing whitespace | Two attributes with no space between them |
| Invalid attribute name | Characters not allowed in attribute names |
| Invalid tag syntax | Tag that does not match Blits template syntax |

Multiple root elements are **not** reported by this rule — that is handled by [`require-single-root-element`](./require-single-root-element.md).

---

## Examples

### Mismatched tag pair

```js
// ✗ error — opening <Element> closed by </Layout>
Blits.Component('Card', {
  template: `
    <Element>
      <Text>Hello</Text>
    </Layout>
  `,
})

// ✓ ok
Blits.Component('Card', {
  template: `
    <Element>
      <Text>Hello</Text>
    </Element>
  `,
})
```

### Unmatched closing tag

```js
// ✗ error — </Text> has no corresponding opening tag
Blits.Component('Card', {
  template: '<Element w="100" /></Text>',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element w="100" />',
})
```

### Self-closing closing tag

```js
// ✗ error — closing tags cannot be self-closing
Blits.Component('Card', {
  template: '<Element w="100"></Element />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element w="100"></Element>',
})
```

### Attributes on closing tag

```js
// ✗ error — closing tags cannot have attributes
Blits.Component('Card', {
  template: '<Element w="100"></Element color="red">',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element w="100" color="red"></Element>',
})
```

### Redundant attribute

```js
// ✗ error — 'color' defined twice (reports at both locations)
Blits.Component('Card', {
  template: '<Element color="red" color="blue" />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element color="red" />',
})
```

### Missing attribute value

```js
// ✗ error — attribute 'w' has no value
Blits.Component('Card', {
  template: '<Element w />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element w="100" />',
})
```

### Unclosed attribute value

```js
// ✗ error — opening quote has no closing quote
Blits.Component('Card', {
  template: '<Element color="red />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element color="red" />',
})
```

### Missing whitespace between attributes

```js
// ✗ error — no space between 'w' and 'h'
Blits.Component('Card', {
  template: '<Element w="100"h="50" />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element w="100" h="50" />',
})
```

### Invalid attribute name

```js
// ✗ error — '!' is not a valid character in an attribute name
Blits.Component('Card', {
  template: '<Element !active="true" />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element :active="$isActive" />',
})
```

### Invalid tag syntax

```js
// ✗ error — tag does not match Blits template syntax
Blits.Component('Card', {
  template: '< Element />',
})

// ✓ ok
Blits.Component('Card', {
  template: '<Element />',
})
```

---

## Reference

**Blits docs — [Template syntax](https://lightning-js.github.io/blits/#/essentials/template_syntax)**

> "Blits uses an easy-to-read _XML-style_ template syntax. [...] Similar to HTML, you can use arguments and nested tags. Self-closing tags and HTML-style comments are also supported in Blits templates."

The rule enforces the constraints that define valid Blits template syntax — tags must be properly opened and closed, attributes must have values, and duplicate attributes are not allowed.

---

## Notes

- Works on regular string literals and template literals in `Blits.Component()` and `Blits.Application()` calls.
- Also runs on `.blits` single-file components when the processor is configured.
- For `MismatchedTagPair` and `RedundantAttribute`, two errors are reported — one at each affected location — so both sides are highlighted in the editor.
