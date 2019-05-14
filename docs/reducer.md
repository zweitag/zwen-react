# Reducer ([Redux Docs](https://redux.js.org/basics/reducers))

We try to keep the state for a single reducer as small as possible. So in the best case we store primitive values (strings, numbers, booleans) or arrays. If we need to store objects, we try to keep them as flat as possible.

```
// => reducers/myFeature/myReducer.js

import * as t from '@/actions/types';

const initialState = '';

export default (state = initialState, action = {}) => {
  const { type, payload } = action;

  if (type === t.MY_ACTION_TYPE) {
    return payload.myProperty;
  }

  return state;
};
```

All reducers and their selectors get exported in the respective folder's *index.js* file by
using `combineReducers` ([Redux Docs](https://redux.js.org/api-reference/combinereducers)):

```
// => reducers/myFeature/index.js

import { combineReducers } from 'redux';

import myReducer from './myReducer';

export default combineReducers({
  myReducer,
});

export * from './myReducer';
```

You should avoid creating reducers at the top level like `reducers/myReducer.js`. As your app grows your structure quickly will get out of hands, so it is a good idea to start organizing it from the very beginning. Read more about this in the "Organizing State" chapter of our [introduction](introduction.md).
