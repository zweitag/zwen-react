/**
 * @module
 * @name reducer
 * @description
 * {@link https://redux.js.org/basics/reducers|Redux Docs}
 *
 * We try to keep the state for a single reducer as small as possible. So in
 * the best case we store primitive values (strings, numbers,
 * booleans) or arrays. If we need to store objects, we try to keep them as
 * flat as possible.
 * @param {any} state Stored value *for this reducer*
 * @param {object} action Currently dispatched action
 * @param {string} action.type Type of the dispatched action
 * @param {object} [action.payload] Additional information sent with the action
 * @returns {any}
 * * Initial state on setup
 * * Unchanged state if no action matches
 * * New state if an action matches
 */

import * as t from '@/actions/types';

const initialState = '';

export default (state = initialState, action = {}) => {
  const { type, payload } = action;

  if (type === t.ACTION_TYPE) {
    return payload;
  }

  return state;
};


/**
 * @module
 * @name selector
 * @description
 * {@link https://redux.js.org/introduction/learning-resources#selectors|Redux Docs}
 *
 * We always use selectors to access the state. That way we can refactor the
 * reducer structure without having to change every single component.
 * @param {object} state The *complete* app state
 * @param {any} modifier We use additional parameters to specify the requested
 * resource accurately (e.g. a certain key in an object).
 * @returns {any} It should return the requested resource in a predictable format.
 */

 export const getStateProp = (state) => state.__ZWEN_PATH_DOTTED__.__ZWEN_REDUCER_NAME__;
