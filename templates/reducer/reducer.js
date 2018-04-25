/**
 * @module
 * @name reducer
 * @description
 * We try to keep the state for a single reducer as small as possible. So in
 * the best case we have states storing primitive values (strings, numbers,
 * booleans) or arrays. If we need to store objects, we try to keep them as
 * flat as possible.
 * @param {any} state Stored value for this reducer
 * @param {object} action Currently dispatched action
 * @param {string} action.type Type of the dispatched action
 * @param {object} action.payload Additional information sent with the action
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
    return 'newState';
  }

  return state;
};
