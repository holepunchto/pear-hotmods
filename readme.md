# pear-hotmods

The `pear-hotmods` library is a Pear ecosystem library.
It automatically reloads Module instances which can be passed on to a live-reload mechanism commonly supplied by frontend-frameworks.

## Install

```
npm install pear-hotmods
```

## API

```js
const { hotmods } = await import('pear-hotmods')
```

```js
import hotmods from 'pear-hotmods'
```

### `hotmods([options, ] listener <Async Function|Function>)`

Call the `listener` function

**Options**

- `paths` `<Array>` - paths allowlist to match against. Paths are drive keys: they are rooted to application root. If unset or empty array, matches against all paths.

## Example

Scenario where Preact framework is being used with prefresh for hot-reloading during
application development:

```js
if (Pear.config.dev) {
  const { hotmods } = await import('pear-hotmods')
  await import('@prefresh/core')
  hotmods({ paths: ['/components'] }, (reloads) => {
    for (const { original, previous, next, type, key } of reloads) {
      console.log('Hot reloading - path:', key, 'operation:', type)
      window.__PREFRESH__.replaceComponent(original, next, true)
      window.__PREFRESH__.replaceComponent(previous, next, true)
    }
  })
}
```

## License

Apache-2.0
