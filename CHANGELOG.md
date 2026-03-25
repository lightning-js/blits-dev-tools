# Changelog

All notable releases across packages in this monorepo. Most recent first.

Full per-package history: [VS Code Extension](vscode-extension/CHANGELOG.md) · [ESLint Plugin](eslint-plugin-blits/CHANGELOG.md)

---

## VS Code Extension — v1.5.2

- Adds arrow function support for `@loaded`, `@error`, and `@updated` event attributes
- Adds syntax highlighting for arrow functions inside event attribute values

## VS Code Extension — v1.5.1

- Fixes template detection issues caused by AST-based detection methods
- Fixes extension activation issues when opening a parent folder of a Blits project
- Fixes bugs related to `.blits` file type implementation
- Adds integration tests
- Removes activation info notification; extension name and version now shown in the status bar
- Adds a check for `prettier-plugin-blits` — leaves template formatting to the Prettier plugin if present

## VS Code Extension — v1.5.0

- Fixes a crash issue during template parsing when the AST was invalid
- Fixes module resolution issues for `.blits` files, including support for import aliases and standard libraries
- Adds support for Blits v2-style props in IntelliSense suggestions

## VS Code Extension — v1.4.0

- Fixed syntax highlighting issue for `@updated` event attribute
- Auto file template provider for newly created `.blits` files
- Snippet support for JavaScript/TypeScript/Blits files
- Reduced the final extension size

## VS Code Extension — v1.3.0

- Template attributes are suggested based on context and parent tags
- Attribute suggestions provide information in an info window
- Attribute data is retrieved from the Blits repository with a local fallback
- Component attributes override built-in attributes when they share the same name
- Selecting an attribute from suggestions automatically inserts its default value
- Event attributes (`@loaded` and `@error`) are syntax highlighted and their expected value format is validated
- Extension features for JS/TS files are only enabled when the workspace has a `@lightningjs/blits` dependency
- Templates with major structural errors are underlined in red with a hover error message
- Fixed interpolated attribute names with hyphens not highlighting correctly
- Improved template handling to prevent false positives for non-Blits `template` properties
- Fixed various syntax highlighting, auto formatting, and code completion bugs

## VS Code Extension — v1.2.1

- Fixes the commenting issue in TypeScript files caused by an incompatible Babel parser plugin

## VS Code Extension — v1.2.0

- Fixes auto-formatting issues (trailing spaces, extra indentation on multiline attribute values)
- Fixes formatting for `.blits` files: template and script sections formatted independently
- Adds IntelliSense suggestions for template tags, supporting built-in and custom components

## VS Code Extension — v1.1.0

- Fixes the error displayed when a `.blits` file is imported into TS/JS files
- Fixes commenting bugs in TS/JS files
- Removes block-level commenting; each line is now commented out separately
- Fixes a bug that removed all empty lines in template strings
- Fixes the JSON file import issue in `.blits` files
- Fixes AST parsing issues, adds additional Babel plugins

## VS Code Extension — v1.0.0

- Implemented the new `.blits` file type with its own TextMate grammar
- Added improved IntelliSense support for template attributes
- Implemented syntax highlighting grammar for Blits code embedded in Markdown
- Added error-checking for for-loop index used in `key` attribute
- Implemented JS/TS editor features for embedded content inside `.blits` files
- Various bug fixes and refactoring

## VS Code Extension — v0.5.0

- Added support for block comments
- Added auto template formatting on save with configurable settings
- Added syntax highlighting for reactive/interpolated attributes
- Fixed auto insertion of default prop values
- Fixed syntax highlighting for `align` attribute

## VS Code Extension — v0.4.1

- Fixed IntelliSense suggestions for TypeScript projects
- Fixed suggested item ordering

## VS Code Extension — v0.4.0

- Enabled template syntax highlighting for TypeScript
