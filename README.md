# zwen-react

*zwen-react* is a code generator CLI for projects using react and redux. We are currently working on a first version which will include generation of:

* [actions](docs/action.md)
* [components](docs/component.md)
* constants
* helpers
* middleware
* [reducers](docs/reducer.md) :white_check_mark:
* [selectors](docs/selector.md)

Later versions will also include generation of barebones project architecture, webpack setup and addition of frequently used things like forms or loaders.

The code generated by *zwen-react* follows our best practices at Zweitag and is therefore highly opinionated.

## Installation
```
npm i -g zwen-react
```
or
```
yarn global add zwen-react
```

## Configuration
You can create a `.zwen` file in your project directory. Currently you only have a single option there.

```
// => .zwen
{
  "srcDir": "frontend/src" // default: "src"
}
```

## Usage
### Reducers
```
zwen reducer path/to/reducer
```
This will create a new reducer file `src/reducers/ui/modal.js` and a test file `src/reducers/ui/modal.test.js`. It will also wire up exports along the path or create new `index.js` files if they don't exist yet.

## Architecture

*zwen-react* expects your frontend architecture to follow the following structure (names written like [this] are examples):
```
|--actions
|----[request]
|------creators.js
|------creators.test.js
|------types.js
|----creators.js
|----types.js
|
|--components
|----[generic]
|------[Button.js]
|----App.js
|
|--constants
|----[endpoints.js]
|
|--helpers
|----[strings.js]
|----[strings.test..js]
|
|--middleware
|----index.js
|----[sendRequest.js]
|----[sendRequest.test..js]
|
|--reducers
|----[filter]
|------index.js
|------[date.js]
|------[date.test..js]
|----index.js
|----selectors.js
|
|--router
|----index.js
|----options.js
|----options.test.js
|
|--selectors
|----index.js
|----filter.js
|----filter.test.js
|
|--stylesheets
|----components
|------[generic]
|--------[button.scss]
|----manifest.scss
|
|--index.js
|--store.js
```

## Usage
### reducers {@link module:reducer|Docs}

`zwen reducer filter/date`
