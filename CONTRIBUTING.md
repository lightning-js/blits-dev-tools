# Contributing to Blits Dev Tools

This monorepo contains three packages for building apps with the [Blits framework](https://lightningjs.io/). Contributions are welcome for all three.

---

## Packages

| Slug | Package | Directory |
|---|---|---|
| `eslint` | `@lightningjs/eslint-plugin-blits` | `eslint-plugin-blits/` |
| `vscode` | `lightning-blits` (VS Code extension) | `vscode-extension/` |
| `prettier` | `@lightningjs/prettier-plugin-blits` | `prettier-plugin-blits/` |

The **slug** is used in branch names to make it immediately clear which package a branch belongs to.

---

## Branches

Persistent branches:

| Branch | Purpose |
|---|---|
| `main` | Stable, released code. Only receives merges from release branches. |
| `dev-eslint` | Active development for the ESLint plugin. |
| `dev-vscode` | Active development for the VS Code extension. |
| `dev-prettier` | Active development for the Prettier plugin. |
| `dev` | Shared repo-level changes (CI, docs, tooling). Not tied to any single package. |

### Feature and fix branches

All work must happen on a dedicated branch, never directly on a dev branch. Branch names follow this format:

```
<slug>/<type>/<short-description>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`

**Examples:**
```
eslint/feat/valid-slot-attribute
eslint/fix/attribute-value-crash
vscode/feat/diagnostics-panel
vscode/fix/null-extension-context
prettier/refactor/template-formatter
prettier/docs/update-readme
```

Branch off from the package's dev branch:

```bash
git checkout dev-eslint
git checkout -b eslint/feat/valid-slot-attribute
```

Open a PR targeting the package's dev branch when the work is ready for review.

### Release branches

When a package is ready to ship, a release branch is cut from its dev branch:

```
release/<package-name>-v<version>
```

**Examples:**
```
release/eslint-plugin-blits-v1.1.0
release/vscode-extension-v1.5.6
release/prettier-plugin-blits-v1.2.0
```

Release PRs target `main`. After merging, the package is published manually.

---

## Releasing a Package

Releasing is handled by the maintainers. The process:

1. Sync the dev branch with `main` before cutting the release:
   ```bash
   git checkout dev-eslint
   git merge main
   ```
2. Create the release branch from the dev branch:
   ```bash
   git checkout -b release/eslint-plugin-blits-v1.1.0
   ```
3. Bump the version in the affected `package.json` and update `CHANGELOG.md`.
4. Open a PR targeting `main`.
5. After merging, publish manually — `npm publish` for ESLint and Prettier packages, `vsce publish` for the VS Code extension.
6. Merge `main` back into all dev branches to propagate any shared file changes:
   ```bash
   git checkout dev-eslint && git merge main
   git checkout dev-vscode && git merge main
   git checkout dev-prettier && git merge main
   git checkout dev && git merge main
   ```

---

## Adding an ESLint Rule

Every new rule must ship with all four of the following — no exceptions:

1. **Rule file** — `eslint-plugin-blits/lib/rules/<rule-name>.js`
2. **Test file** — `eslint-plugin-blits/tests/rules/<rule-name>.test.js` using `RuleTester`
3. **Docs file** — `eslint-plugin-blits/docs/rules/<rule-name>.md` with a `## Reference` section linking to the relevant Blits documentation
4. **Registration** — entry in `eslint-plugin-blits/lib/index.js` (`rules` object and `configs.recommended.rules`)

A rule PR that is missing any of these will not be merged.

---

## Pull Requests

A pull request template is provided when you open a PR. Fill in the relevant sections and delete anything that doesn't apply.

- Feature and fix PRs target the package's dev branch (`dev-eslint`, `dev-vscode`, or `dev-prettier`).
- Shared repo-level changes (CI, docs, tooling) target `dev`.
- Release PRs target `main`.
- Keep PRs focused on a single package. If a change spans packages, note it in the PR description.

---

## Local Setup

**Prerequisites:** Node.js `>=24.0.0`

```bash
# Install all workspace dependencies
npm install

# Run tests across all packages
npm test

# Run linting across all packages
npm run lint

# Build all packages
npm run build
```

**Package-specific commands:**
```bash
# VS Code extension
npm run vscode:package     # Package the extension as a .vsix
npm run vscode:publish     # Publish to the VS Code Marketplace
npm run vscode:test        # Run extension integration tests

# ESLint plugin
npm run eslint:publish     # Publish to npm

# Prettier plugin
npm run prettier:dev       # Run in dev/watch mode
```

---

## Code Style

- Follow the existing code style within each package — consistency takes priority over personal preference.
- All packages are written in plain JavaScript. Do not introduce TypeScript source files.
- Keep changes minimal and focused. Avoid refactoring code outside the scope of your task.
- Do not modify root-level `package.json`, `package-lock.json`, or shared config files without noting it in the PR description.

---

## Reporting Issues

Use the [GitHub issue tracker](https://github.com/lightning-js/blits-dev-tools/issues). When reporting a bug, include:

- Which package is affected (`eslint-plugin-blits`, `vscode-extension`, or `prettier-plugin-blits`)
- Package version
- Steps to reproduce
- Expected vs. actual behavior
