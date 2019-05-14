# Middleware ([Redux Docs](https://redux.js.org/advanced/middleware))

As soon as your app leaves the typical act-and-react circle and starts working with side-effects you will need some middleware. Most of the time this happens first when you want to fetch data from an API.

Redux middleware might seem overwhelming at the beginning but is actually pretty straightforward. An action that gets dispatched goes through every registered middleware first and only after that to the reducers:

```
// simplified
dispatch(action) -> middleware(action) -> reducers(action)
```

That means you could change the action's payload before it reaches a specific reducer – or do not forward it at all!

A typical example, again, is fetching data from an API. This process might get started by dispatching a `SEND_REQUEST` or `FETCH_DATA` action somewhere in a [component](component.md). This action reaches our middleware:

```
export const store => next => async action => {
  if (action.type === 'FETCH_DATA') {
    const data = await myApiCall(payload.dataToFetch);

    payload.responseData = data;

    next(action);
  }

  else {
    next(action);
  }
}
```

It is very important to always call `next(action)` if your middleware doesn't react to it – otherwise it will never reach the reducers.

In this case a [reducer](reducer.md) might react to the action type `FETCH_DATA` and add `payload.responseData` to its state. From there it will reach your components.

To notify users, if something went wrong – the API might be down – we can wrap the API call in a `try/catch` statement:

```
export const store => next => async action => {
  if (action.type === 'FETCH_DATA') {
    try {
      const data = await myApiCall(payload.dataToFetch);
      payload.responseData = data;
      next(action);

    } catch (error) {
      store.dispatch(actions.requestError(error));
    }
  // ...
```

As you see, in case of an error the `FETCH_DATA` action will not get forwarded. Instead we dispatch a new action that notifies about the error that occurred. You know the rest of the story: a reducer catches this action and displays the information to the user.
