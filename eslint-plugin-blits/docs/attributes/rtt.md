# rtt

Enables render-to-texture mode, rendering the element and its children to an off-screen texture.

**Attribute** · Reactive

---

## Used in

| Tag | |
|---|---|
| `<Element>` |  |

---

## Accepted values

**Enum:** `true`, `false`

---

## Examples

```blits
<!-- valid usage -->
<Element w="500" h="500" rtt="true">
  <!-- complex child tree rendered to texture -->
</Element>

<!-- invalid usage -->
<Element w="500" h="500" rtt="yes" />
```

---

## What is not validated

Reactive bindings are not validated by the rule:

```blits
<!-- not checked -->
<Element w="500" h="500" :rtt="$shouldUseRtt" />
```

---

## Reference

**Blits CHANGELOG — [v0.9.9](https://github.com/lightning-js/blits/blob/master/CHANGELOG.md)**

> "Added `rtt` (render-to-texture) attribute to Components and Elements."
