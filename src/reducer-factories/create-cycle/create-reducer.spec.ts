import makeCreateReducer from './create-reducer';

import {
  assertOutputIsFunction,
  assertInitialStateReturnedOnInit,
  assertStateReturnedOnInvalidActionType,
} from './../test-utils/common-specs';
import { API_ACTION_PREFIXES, API_LIFECYCLE_SUFFIXES } from '../../actions';

const { CREATE } = API_ACTION_PREFIXES;
const { FAILURE, SUCCESS } = API_LIFECYCLE_SUFFIXES;
const CREATE_RESOURCE_FAILURE = `${CREATE}_*_${FAILURE}`;
const CREATE_RESOURCE_SUCCESS = `${CREATE}_*_${SUCCESS}`;

describe('makeCreateReducer()', () => {
  const entitiesPath = 'byId';
  const defaultProps = { entitiesPath };

  assertOutputIsFunction(() => makeCreateReducer(defaultProps));

  assertInitialStateReturnedOnInit(() => makeCreateReducer(defaultProps));

  assertStateReturnedOnInvalidActionType(
    () => makeCreateReducer(defaultProps),
    CREATE
  );

  it(`sets errors at the state slice root on the *_FAILURE action.type`, () => {
    const reducer = makeCreateReducer(defaultProps);
    const mockState = {};
    const initialState = reducer(mockState, { type: '@@INIT' });
    expect(initialState).toEqual(mockState);

    const failureAction = {
      type: CREATE_RESOURCE_FAILURE,
      errors: ['something went wrong!'],
    };
    const nextState = reducer(mockState, failureAction);

    expect(nextState).toHaveProperty('errors');
  });

  describe('outcomes with the *_SUCCESS action.type', () => {
    it('unsets the root errors and sets the payload to the payload.id', () => {
      const reducer = makeCreateReducer(defaultProps);
      const initialState = {
        errors: ['Some error while creating'],
        [entitiesPath]: {
          '123': { id: '123', name: 'foo' },
        },
      };
      const successAction = {
        type: CREATE_RESOURCE_SUCCESS,
        payload: {
          id: '456',
          name: 'bar',
        },
      };
      const nextState = reducer(initialState, successAction);

      // Check existing entity is still present
      expect(nextState[entitiesPath]).toHaveProperty('123');
      expect(nextState[entitiesPath]).toHaveProperty(successAction.payload.id);
      expect(nextState).not.toHaveProperty('errors');
    });
  });
});
