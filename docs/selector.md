# Selector [Redux Docs](https://redux.js.org/introduction/learning-resources#selectors)

We always use selectors to access the state. That way we can refactor the reducer structure without having to change every single component.

Every [reducer](reducer.md) file contains a simple selector for accessing the respective state.

```
// => reducers/myFeature/myReducer.js

export const getStateProp = state => state.myFeature.myReducer;
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

Sometimes you want to combine information from different areas of the state to keep the logic out of the component. A good way of doing this is by using `createSelector` ([reselect Docs](https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc)):

```
// => selectors/ui.js
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
Since these types of selectors can't be matched with a single reducer, they should go in their own folder and file.
