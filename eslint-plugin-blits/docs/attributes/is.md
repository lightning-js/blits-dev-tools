# is

Dynamically instantiates a Component based on a state variable or prop value.

**Attribute** · Static

---

## Used in

| Tag | |
|---|---|
| `<Component>` | Any user-defined PascalCase component |

---

## Accepted values

**String** (name of the component to instantiate).

---

## Examples

```blits
<!-- valid usage -->
<Component is="$firstComponent" />
<Component is="$secondComponent" x="500" />
```

---

## What is not validated

The string value of the `is` directive is not validated against registered components by the `valid-attribute-value` rule because verifying the existence of the component would require cross-file and script-block analysis.

**Note:** At the moment it's not possible to use the `is`-attribute as a _reactive_ attribute and have a component change type after instantiation. This limitation is enforced by the `no-reactive-is-directive` rule (E-060). Furthermore, the `is` directive is only valid on the `<Component>` tag, enforced by `is-directive-requires-component-tag` (E-061).

---

## Reference

**Blits docs — [Directives - Is-directive](https://lightning-js.github.io/blits/#/essentials/directives)**

> "The `is` directive allows you to dynamically instantiate a Component based on a `state` variable or a passed `prop`.
>
> It is very useful in combination with API driven Apps, where the type of Component to use, depends on what data is returned (i.e. a `Poster` or a `HeroImage`).
>
> The `is`-component should always be used together with the built-in `Component`-tag."
