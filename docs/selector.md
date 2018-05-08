# Selector [Redux Docs](https://redux.js.org/introduction/learning-resources#selectors)

We always use selectors to access the state. That way we can refactor the
reducer structure without having to change every single component. Selectors
are written inside the respective [reducer](/reducer.md) file.

```
// => reducers/myFeature/myReducer.js

export const getStateProp = (state) => state.pathToReducer.reducerName;
```

Similar to reducers, selectors get exported on each folder level

```
// => reducers/myFeature/index.js

export * from './myFeature/myReducer';
```

and all folders from the *index.js* at top level:

```
// => reducers/myFeature/selectors.js

export * from './myFeature';
```

When using multiple selectors it might be a good idea to combine them by using
`createSelector` ([reselect Docs](https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc)):

```
import { createSelector } from 'reselect';

export const getPostAuthor = createSelector(
  [
    getUsers,
    getSelectedPost,
  ],
  (users, post) => ({
    author: users.find(user => post.author.id === user.id),
  })
);
```
