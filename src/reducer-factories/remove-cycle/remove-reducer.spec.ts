import removeReducerFactory from './remove-reducer';
import { API_ACTION_PREFIXES, API_LIFECYCLE_SUFFIXES } from '../../actions';
import {
  assertOutputIsFunction,
  assertInitialStateReturnedOnInit,
  assertStateReturnedOnInvalidActionType,
  assertPendingStateSet,
  assertErrorsSet,
} from './../test-utils/common-specs';

const { START, ERROR, SUCCESS } = API_LIFECYCLE_SUFFIXES;
const { REMOVE } = API_ACTION_PREFIXES;
const REMOVE_RESOURCE_START = `${REMOVE}_*_${START}`;
const REMOVE_RESOURCE_ERROR = `${REMOVE}_*_${ERROR}`;
const REMOVE_RESOURCE_SUCCESS = `${REMOVE}_*_${SUCCESS}`;

describe('removeReducerFactory()', () => {
  const entitiesPath = 'byId';
  const defaultProps = { entitiesPath };

  assertOutputIsFunction(() => removeReducerFactory(defaultProps));

  assertInitialStateReturnedOnInit(() => removeReducerFactory(defaultProps));

  assertStateReturnedOnInvalidActionType(
    () => removeReducerFactory(defaultProps),
    REMOVE
  );

  assertPendingStateSet(
    () => removeReducerFactory(defaultProps),
    REMOVE_RESOURCE_START,
    'isRemoving'
  );

  assertErrorsSet(
    () => removeReducerFactory(defaultProps),
    REMOVE_RESOURCE_ERROR,
    'isRemoving'
  );

  it('throws an error if a valid REMOVE action, but no meta.referenceId', () => {
    const invalidAction = {
      type: REMOVE_RESOURCE_START,
      // no meta.referenceId
    };
    const reducer = removeReducerFactory(defaultProps);

    expect(() => reducer({}, invalidAction)).toThrow();
  });

  describe('outcomes with the *_SUCCESS action.type', () => {
    it('deletes the entity at the meta.referenceId', () => {
      const referenceId = '123';
      const successAction = {
        type: REMOVE_RESOURCE_SUCCESS,
        meta: { referenceId },
      };
      const initialState = {
        [entitiesPath]: {
          [referenceId]: {
            id: referenceId,
            name: 'foo',
          },
          '234': {
            id: '234',
            name: 'bar',
          },
        },
      };
      const reducer = removeReducerFactory(defaultProps);
      const nextState = reducer(initialState, successAction);

      // Assert an existing entity isn't removed as well
      expect(nextState[entitiesPath]).toHaveProperty('234');
      expect(nextState[entitiesPath]).not.toHaveProperty(referenceId);
    });
  });
});
