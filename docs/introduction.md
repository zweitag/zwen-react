# Introduction
## Journey of the State
The most important architectural aspect of modern web applications is state. State is everywhere: Is the menu open? Is the user logged in? Is the app processing an Ajax request? Is the mouse hovering over an item? Questions like that need to be answered in almost every web app nowadays.

In most React tutorials you find state being organized inside components. You'd use `setState()` a lot and have your state relatively close to where it's needed. But as soon as the app grows a bit larger – and most apps do – you'll realize that the state is spreaded all over the place and it's getting harder to keep everything clean.

Enter Redux (among other options). Using the idea of a single source of truth the development focus get shifted from writing components to organizing state changes.

There are many tutorials for writing apps with Redux, so this introduction will focus on how the combination of React and Redux will work when you're using _zwen_.

State changes can happen in different parts of the app, but the most common source is the user's interaction with something in the UI.

Let's take this button element:
```
// => components/MenuButton.js
<Button onClick={onToggleMenu} />
```
To wire it up we need to utilize the `mapDispatchToProps` function which is part of the `react-redux` bindings. (Read more about connected components in the [components' docs](component.md)).
```
// => components/MenuButton.js
const mapDispatchToProps = dispatch => ({
  onToggleMenu: dispatch(actions.toggleMenu()),
});
```
This is where we leave the component and enter the world of Redux. Since we want to dispatch the `toggleMenu` action, we need to define what this action looks like:
```
// => actions/ui/creators.js
const toggleMenu = () => ({
  type: t.TOGGLE_MENU,
});
```
This _action creator_ does nothing more that returning an object with a specific _type_. We can also add a _payload_, so that more information can get passed through the lines. (Read more about actions in the [actions' docs](action.md)).

Of course the _type_ needs also to be defined, but this is pretty staightforward:
```
// => actions/ui/types.js
epxort const TOGGLE_MENU = 'ui/TOGGLE_MENU';
```

Alright, so what happens until now is that the `dispatch` method in our `MenuButton` component sends out an action with a specific type. By definition this actions arrives at every single _reducer_ of the app. Each can decide, if this action concerns it and act accordingly. Keep in mind that it won't have access to the complete state but only to its own segment. (Read more about reducers in the [reducers' docs](reducer.md)).
```
// => reducers/ui/menu.js
export default (state = false, action) => {
  if (action.type === t.TOGGLE_MENU) {
    return !state;
  }
  return state;
}
```

The reducer realized that it needs to change its state, but how do we reflect this in our UI? Easy, add a selector that returns exactly what we need. Be carful to always pass in the complete state object. That way you only have make changes to the selector if you choose to refactor the state structure.
```
// => reducers/ui/menu.js
export const getIsMenuOpen = state => state.ui.menu;
```
And close the circle at the menu component:
```
// => components/Menu.js
const mapStateToProps = state => ({
  isOpen: selectors.getIsMenuOpen(state),
});

// ...

{isOpen && <Menu />}
```
So the user's click in one component triggered a chain reaction that lead to firing an action through all reducers, changing the state and receiving the updated state at another component. React will notice that the component's properties have changed and will update the UI accordingly.

## Organizing State
In smaller apps it is easy to just create top level reducer and keep a flat organization of your state. That might look like this:
```
|--reducers
|----menu.js
|----sidebar.js
|----cookies.js
```

However, in our point of view it doesn't make much sense to use Redux in these apps anyway. Why would you create such a big overhead if it much simpler to use the component state provided by React?

A good starting point when thinking about state organization is the division into five different types of frontend state:

```
|--reducers
|----control / ui
|------[...reducers]
|------index.js
|----data
|------[...reducers]
|------index.js
|----communication
|------[...reducers]
|------index.js
|----session
|------[...reducers]
|------index.js
|----location / router
|------[...reducers]
|------index.js
```

### Control / UI
Everything the user has direct control over, for example by toggling a checkbox or clicking a button. Most of the time the effects of changing the control state are displayed directly in the user interface.

Examples:
```
isMenuOpen: true
filter:     'my phrase'
uiTheme:    'dark'
```

### Data
The things an API might deliver for your app to display. Or the state a user creates to store in some kind of database.

Examples:
```
blogPosts:  [{ id: 1, content: 'My Post' }, ...]
users:      [{ name: 'Uta' }]
```

### Communication
If you want to display a loading screen or an error if something went wrong with an API request, communication would be the according state to hold this information.

Examples:
```
isLoading:  true
errors:     ['Something went wrong!']
```

### Session
State that might not necessarily be displayed to the user, but is still important for the app to function correctly. If you're keeping an API token for your user in their local storage you could load it into the session state while the app is initializing.

Examples:
```
userId:      13
auth_token:  abc123_abc
```

### Location / Router
Depending on your app this state might not be in your redux store. However, as a single source of truth we recommend that you use a routing solution that operates tightly with redux like [redux-first-router](https://github.com/faceyspacey/redux-first-router).

Examples:
```
hash:       '#chapter-1'
query:      'sort=asc'
```
