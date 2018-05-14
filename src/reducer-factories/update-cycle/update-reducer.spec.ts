import {
  assertOutputIsFunction,
  assertInitialStateReturnedOnInit,
  assertStateReturnedOnInvalidActionType,
  assertPendingStateSet,
  assertErrorsSet,
} from './../test-utils/common-specs';
import updateReducerFactory from './update-reducer';
import { API_LIFECYCLE_SUFFIXES, API_ACTION_PREFIXES } from '../../actions';

const { START, FAILURE, SUCCESS } = API_LIFECYCLE_SUFFIXES;
const { UPDATE } = API_ACTION_PREFIXES;
const UPDATE_RESOURCE_START = `${UPDATE}_*_${START}`;
const UPDATE_RESOURCE_FAILURE = `${UPDATE}_*_${FAILURE}`;
const UPDATE_RESOURCE_SUCCESS = `${UPDATE}_*_${SUCCESS}`;

describe('updateReducerFactory()', () => {
  const entitiesPath = 'byId';
  const defaultProps = { entitiesPath };

  assertOutputIsFunction(() => updateReducerFactory(defaultProps));

  assertInitialStateReturnedOnInit(() => updateReducerFactory(defaultProps));

  assertStateReturnedOnInvalidActionType(
    () => updateReducerFactory(defaultProps),
    UPDATE
  );

  assertPendingStateSet(
    () => updateReducerFactory(defaultProps),
    UPDATE_RESOURCE_START,
    'isUpdating'
  );

  assertErrorsSet(
    () => updateReducerFactory(defaultProps),
    UPDATE_RESOURCE_FAILURE,
    'isUpdating'
  );

  it('throws an error if a valid REMOVE action, but no meta.referenceId', () => {
    const invalidAction = {
      type: UPDATE_RESOURCE_START,
      // no meta.referenceId
    };
    const reducer = updateReducerFactory(defaultProps);

    expect(() => reducer({}, invalidAction)).toThrow();
  });

  describe('outcomes with the *_SUCCESS action.type', () => {
    it('updates the entity at the meta.referenceId', () => {
      const referenceId = '123';
      const initialState = {
        [entitiesPath]: {
          [referenceId]: {
            id: referenceId,
            name: 'foo',
          },
        },
      };
      const successAction = {
        type: UPDATE_RESOURCE_SUCCESS,
        payload: {
          id: referenceId,
          anotherAttr: 'bar',
        },
        meta: { referenceId },
      };
      const reducer = updateReducerFactory(defaultProps);
      const nextState = reducer(initialState, successAction);
      const resultEntity = nextState[entitiesPath][referenceId];

      expect(resultEntity).toEqual({
        ...initialState[entitiesPath][referenceId],
        ...successAction.payload,
        isUpdating: false, // Added after API cycle finishes
      });
    });
  });
});
