import * as t from '@/actions/types';
import reducer, * as selectors from './{{reducerName}}';

describe('reducers/__ZWEN_PATH__/__ZWEN_REDUCER_NAME__', () => {
  it('should return the state if no action matches', () => {
    const mockAction = {
      type: 'test/TEST_ACTION',
    };
    const mockState = {
      test: true,
    };

    const state = reducer(mockState, mockAction);

    expect(state).toHaveProperty('test', true);
  });

  it('should store ...', () => {
    const mockAction = {
      type: t.ACTION_TYPE,
      payload: 'testValue',
    };
    const state = reducer(undefined, mockAction);

    expect(state).toBe('testValue');
  });
});

describe('reducers/__ZWEN_PATH__/__ZWEN_REDUCER_NAME__/selectors', () => {
  describe('getStateProp', () => {
    it('should return the correct value from state', () => {
      const mockState = {
        __ZWEN_PATH_AS_OBJECT__: {
          __ZWEN_REDUCER_NAME__: 'testValue',
        },
      };
      const value = selectors.getStateProp(mockState);

      expect(value).toBe('testValue');
    });
  });
});
