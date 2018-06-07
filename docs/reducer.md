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

All reducers get exported in their respective folder's *index.js* file by
using `combineReducers` ([Redux Docs](https://redux.js.org/api-reference/combinereducers)):

```
// => reducers/myFeature/index.js

import { combineReducers } from 'redux';

import myReducer from './myReducer';

export default combineReducers({
  myReducer,
});
```

All reducer folders get accessed by the top level *index.js* file

```
// => reducers/index.js

export default as myFeature from './myFeature';
```
