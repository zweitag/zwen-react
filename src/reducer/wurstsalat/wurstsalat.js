import * as t from '@/actions/types';

// define your initial State
const initialState = '';

export default (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch(type) {
    /*
    case t.YOUR_ACTION {
      // don't forget to add your action type to the types.js file or generate it with zwen generate actiontype < YOUR_ACTION >
      // return the next state depending on the action
    }
    */
    default:
      return state;
  }
};
