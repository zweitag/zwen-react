import * as t from '@/actions/types';

const initialState = '';

export default (state = initialState, action = {}) => {
  const { type, payload } = action;

  if (type === t.ACTION_TYPE) {
    return payload;
  }

  return state;
};

export const getStateProp = (state) => state.__ZWEN_PATH_DOTTED__.test123;
