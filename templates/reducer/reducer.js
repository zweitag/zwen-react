/**
 * @module
 * @name reducer
 * @description We try to keep reducers as small as possible.
 * @param {any} state Stored value for this reducer
 * @param {object} action Currently dispatched action
 * @param {string} action.type Type of the dispatched action
 * @param {object} action.payload Additional information sent with the action
 * @returns {any}
 * * Initial state on setup
 * * Unchanged state if no action matches
 * * New state if an action matches
 */

 const initialState = '';

 export default (state = initialState, action = {}) => {
   const { type, payload } = action;
   return state;
 }
