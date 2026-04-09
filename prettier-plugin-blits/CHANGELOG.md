# Change Log

## v1.0.0

- First release of `@lightningjs/prettier-plugin-blits`
- Formats Blits template strings inside `Blits.Component()` and `Blits.Application()`
- Adds `blitsWrapAttributes` to wrap long attribute lists across multiple lines
- Adds `blitsClosingBacktick` to control where the closing backtick is placed
- Adds `blitsClosingBracketSameLine` to keep the closing `>` on the last attribute line in multiline tags
- Adds `blitsPreserveBlankLines` to preserve blank lines between sibling elements
- Adds `blitsNormalizeComments` to normalize HTML comment spacing
- Adds `blitsTrimAttributeValues` to trim leading and trailing whitespace in attribute values
- Adds `blitsSelfClosingTags` to collapse empty tags to self-closing form
- Adds `blitsCollapseSingleElement` to collapse eligible single-element multiline templates
- Preserves escape sequences in attribute values correctly
- Preserves multiline template structure by default
