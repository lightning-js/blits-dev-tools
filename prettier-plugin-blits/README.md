# Prettier Plugin for Blits

Formats Blits template strings in JavaScript and TypeScript files.

Blits components define their UI in a `template` string inside `Blits.Component()` or `Blits.Application()`. This plugin teaches Prettier to format those templates — indenting nested elements, breaking long attribute lists across lines, and keeping short templates inline.

## Requirements

- Node.js 18+
- Prettier 3.x

## Installation

```bash
npm install --save-dev @lightningjs/prettier-plugin-blits
```

### With a `.prettierrc` file

Add the plugin to your Prettier config. If you have other plugins, keep them alongside it:

```json
{
  "plugins": ["@lightningjs/prettier-plugin-blits"]
}
```

### With `eslint-plugin-prettier`

If your project runs Prettier through ESLint via `eslint-plugin-prettier`, add the plugin to the inline options in your ESLint config instead:

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
    },
  ],
}
```

> **Note:** `eslint-plugin-prettier` v5+ is required for Prettier 3 compatibility. If you are upgrading from Prettier 2, also update `eslint-plugin-prettier` to `^5.0.0` and `eslint-config-prettier` to `^9.0.0`.

## Formatting rules

### Where it applies

Only the `template` property value inside `Blits.Component()` or `Blits.Application()` calls. Everything else in your file is formatted normally by Prettier. Template literals that contain `${...}` interpolations are left untouched.

### Inline vs multi-line

Short templates that fit within `printWidth` stay on one line:

```js
template: `<Element x="20" y="20" />`
```

Longer templates break to multi-line with the content indented:

```js
template: `
  <Element>
    <Text content="Hello" />
  </Element>
`
```

### Attribute wrapping

When a tag's attributes fit within `printWidth`, they stay on one line. When they don't, each attribute gets its own indented line and `/>` moves to the next line:

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

Child elements are indented by `tabWidth` (default: 2) relative to their parent:

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

Blank lines between sibling elements are preserved. Multiple consecutive blank lines are collapsed to one:

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

Comments are normalized to have exactly one space after `<!--` and before `-->`. Extra dashes are also collapsed:

```js
<!--Title -->        →  <!-- Title -->
<!--- section --->   →  <!-- section -->
<!-- correct -->     →  <!-- correct -->
```

### Attribute value trimming

Accidental leading/trailing whitespace inside attribute value quotes is removed. The value itself is never modified:

```js
:w=" 354 -14 "   →  :w="354 -14"
w="100"          →  w="100"
```

Multiline attribute values (e.g. `:transition="{\n  prop: 'x'\n}"`) are not affected — only space/tab padding is stripped, never newlines.

### What is never changed

- **Attribute values** — reactive bindings (`:color="$myColor"`), event handlers (`@loaded="$onLoad"`), `:for` expressions, `$variable` references, arrow functions, and `:transition` objects all pass through exactly as written
- **Attribute order** — attributes are never reordered or sorted

### Configuration

Standard Prettier options apply:

| Option | Effect |
|---|---|
| `printWidth` | Controls when attribute lists and nested templates wrap (default: 80) |
| `tabWidth` | Controls indentation inside templates (default: 2) |

The plugin also exposes its own formatting rules. Each rule can be enabled or disabled independently:

| Option | Default | Description |
|---|---|---|
| `blitsWrapAttributes` | `true` | Wrap element attributes to individual lines when the tag exceeds `printWidth`. Set to `false` to always keep attributes inline. |
| `blitsClosingBacktick` | `"newline"` | Position of the closing backtick in multi-line templates. `"newline"` puts it on its own line; `"inline"` puts it at the end of the last content line. |
| `blitsPreserveBlankLines` | `true` | Preserve blank lines between sibling elements. Multiple consecutive blank lines are collapsed to one. |
| `blitsNormalizeComments` | `true` | Normalize comment whitespace — ensures one space after `<!--` and before `-->`, and collapses extra dashes. |
| `blitsTrimAttributeValues` | `true` | Trim leading/trailing spaces and tabs from attribute values. Never removes newlines, so multiline values are safe. |
| `blitsClosingBracketSameLine` | `false` | Put the closing `>` of a multi-line opening tag on the same line as the last attribute. |
| `blitsSelfClosingTags` | `false` | Collapse empty open/close tag pairs (`<Tag></Tag>`) into self-closing form (`<Tag />`). Disabled by default — `<Tag></Tag>` signals intent to add children. |

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

## License

Apache 2.0 — see [LICENSE](../LICENSE)
