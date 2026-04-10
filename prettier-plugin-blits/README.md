# Prettier Plugin for Blits

Formats the `template` string inside `Blits.Component()` and `Blits.Application()` calls, in JavaScript and TypeScript files.

## Requirements

- Node.js 18+
- Prettier 3.x

## Installation

```bash
npm install --save-dev @lightningjs/prettier-plugin-blits
```

### If you use a `.prettierrc`

Add the plugin to your Prettier config. If you already use other plugins, just include this one in the same list:

```json
{
  "plugins": ["@lightningjs/prettier-plugin-blits"],
  "blitsWrapAttributes": true,
  "blitsClosingBacktick": "newline",
  "blitsPreserveBlankLines": true
}
```

### If you run Prettier through ESLint

If your setup uses `eslint-plugin-prettier`, add the plugin to the inline Prettier options in your ESLint config:

```js
// .eslintrc.cjs
rules: {
  'prettier/prettier': [
    'error',
    {
      singleQuote: true,
      semi: false,
      // ... your other prettier options
      plugins: ['@lightningjs/prettier-plugin-blits'],
      // you can change plugin options like this
      blitsWrapAttributes: true,
      blitsClosingBacktick: 'newline',
      blitsPreserveBlankLines: true,
    },
  ],
}
```

> `eslint-plugin-prettier` v5+ is required for Prettier 3. If you are upgrading from Prettier 2, also update `eslint-plugin-prettier` to `^5.0.0` and `eslint-config-prettier` to `^9.0.0`.

### If you use a `prettier.config.js`

```js
export default {
  plugins: ['@lightningjs/prettier-plugin-blits'],
  // you can change plugin options like this
  blitsWrapAttributes: true,
  blitsClosingBacktick: 'newline',
  blitsPreserveBlankLines: true,
}
```

For CommonJS projects:

```js
module.exports = {
  plugins: ['@lightningjs/prettier-plugin-blits'],
  // you can change plugin options like this
  blitsWrapAttributes: true,
  blitsClosingBacktick: 'newline',
  blitsPreserveBlankLines: true,
}
```

## What the plugin formats

### Where it applies

The plugin only touches the value of the `template` property inside `Blits.Component()` or `Blits.Application()`. Everything else in the file is still handled by Prettier as usual.

Template literals with `${...}` interpolations are left alone.

### Inline vs multi-line

Short templates that fit within `printWidth` stay on one line:

```js
template: `<Element x="20" y="20" />`
```

Longer templates expand to multiple lines by default, with the content indented:

```js
template: `
  <Element>
    <Text content="Hello" />
  </Element>
`
```

### Attribute wrapping

When a tag and its attributes fit within `printWidth`, they stay on one line. If they do not fit, each attribute moves to its own line:

```js
// fits on one line — stays inline
<Text content="Hello" color="#ffffff" />

// too long — each attribute on its own line
<Image
  src="$imgSrc"
  w="1920"
  h="1080"
  mountX="0.5"
  mountY="0.5"
/>
```

### Children

Child elements are indented relative to their parent using your configured `tabWidth`:

```js
template: `
  <Element>
    <Layout>
      <Text content="Hello" />
    </Layout>
  </Element>
`
```

### Blank lines

Blank lines between sibling elements are preserved. If there are several in a row, they are collapsed to a single blank line:

```js
template: `
  <Element>
    <!-- Header -->
    <Text content="$title" />
    <Image src="$poster" />

    <!-- Controls -->
    <Button label="Play" />
    <Button label="More Info" />
  </Element>
`
```

### Comment normalization

Comments are formatted to a consistent style: one space after `<!--`, one space before `-->`, and no extra dashes:

```js
<!--Title -->        →  <!-- Title -->
<!--- section --->   →  <!-- section -->
<!-- correct -->     →  <!-- correct -->
```

### Attribute value trimming

Leading or trailing spaces inside quoted attribute values are removed:

```js
:w=" 354 -14 "   →  :w="354 -14"
w="100"          →  w="100"
```

Multiline attribute values such as `:transition="{\n  prop: 'x'\n}"` are left as they are. Only leading and trailing spaces or tabs are trimmed, never newlines.

### What is never changed

- **Attribute values** — reactive bindings (`:color="$myColor"`), event handlers (`@loaded="$onLoad"`), `:for` expressions, `$variable` references, arrow functions, and `:transition` objects are preserved as written
- **Attribute order** — attributes are never reordered or sorted

### Configuration

Standard Prettier options apply:

| Option | Effect |
|---|---|
| `printWidth` | Controls when attribute lists and nested templates wrap (default: 80) |
| `tabWidth` | Controls indentation inside templates (default: 2) |

The plugin adds these Blits-specific options on top:

| Option | Default | Description |
|---|---|---|
| `blitsWrapAttributes` | `true` | Wrap attributes onto separate lines when the tag exceeds `printWidth`. Set to `false` to keep attributes inline. |
| `blitsClosingBacktick` | `"newline"` | Controls where the closing backtick goes in multi-line templates. `"newline"` puts it on its own line, while `"inline"` keeps it at the end of the final content line. |
| `blitsPreserveBlankLines` | `true` | Keeps blank lines between sibling elements. Consecutive blank lines are collapsed to one. |
| `blitsNormalizeComments` | `true` | Normalizes comment spacing by enforcing one space after `<!--` and before `-->`, and by collapsing extra dashes. |
| `blitsTrimAttributeValues` | `true` | Trims leading and trailing spaces or tabs inside attribute values. Newlines are preserved, so multiline values stay safe. |
| `blitsClosingBracketSameLine` | `false` | Places the closing `>` of a multi-line opening tag on the same line as the last attribute. |
| `blitsSelfClosingTags` | `false` | Converts empty open/close tag pairs like `<Tag></Tag>` into `<Tag />`. This is off by default because `<Tag></Tag>` can also communicate intent. |
| `blitsCollapseSingleElement` | `false` | Allows a single-root-element template to collapse to one line when it fits within `printWidth`. This is off by default so existing multi-line intent is preserved. |

**`blitsClosingBacktick: "newline"` (default):**
```js
template: `
  <Element>
    <Text content="hello" />
  </Element>
`
```

**`blitsClosingBacktick: "inline"`:**
```js
template: `
  <Element>
    <Text content="hello" />
  </Element>`
```

**`blitsClosingBracketSameLine: false` (default):**
```js
<Element
  w="1920"
  h="1080"
  color="#fff"
>
  <Text content="hello" />
</Element>
```

**`blitsClosingBracketSameLine: true`:**
```js
<Element
  w="1920"
  h="1080"
  color="#fff">
  <Text content="hello" />
</Element>
```

**`blitsCollapseSingleElement: false` (default) — multi-line preserved:**
```js
template: `
  <Element w="100" h="200" />
`,
```

**`blitsCollapseSingleElement: true` — collapsed when fits in printWidth:**
```js
template: `<Element w="100" h="200" />`,
```
