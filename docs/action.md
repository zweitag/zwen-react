# Action ([Redux Docs](https://redux.js.org/basics/actions))

Actions are nothing more than an object with a `type` property. What makes them an _action_ is getting _dispatched_ by the Redux store. To use an action you'll typically need _action creators_.
```
// => actions/myFeature/creators.js
import * as t from '@/actions/types';

export const doSomething = () => ({
  type: t.DO_SOMETHING,
});
```

To prevent spelling errors, _action types_ are stored in variables.
```
// => actions/myFeature/types.js
export const DO_SOMETHING = 'myFeature/DO_SOMETHING';
```
Both _types_ and _creators_ are being exported like this:
```
// => actions/index.js
export * from './myFeature';
```

```
// => actions/myFeature/index.js
export * from './creators';
```

```
// => actions/types.js
export * from './myFeature/types';
```

Sometimes the function instead of the resulting object is being called _action_. While this is not accurate, we also give in to this confusion by simply calling imported _creators_ as _actions_:
```
// => components/MyComponent.js
import * as actions from '@/actions';
```
