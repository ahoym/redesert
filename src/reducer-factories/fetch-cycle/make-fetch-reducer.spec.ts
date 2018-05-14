import makeFetchLifeCycle from './make-fetch-reducer';
import { API_ACTION_PREFIXES, API_LIFECYCLE_SUFFIXES } from '../../actions';
import {
  assertOutputIsFunction,
  assertInitialStateReturnedOnInit,
  assertStateReturnedOnInvalidActionType,
  assertPendingStateSet,
  assertErrorsSet,
} from '../test-utils/common-specs';

const { FETCH } = API_ACTION_PREFIXES;
const { START, SUCCESS, ERROR } = API_LIFECYCLE_SUFFIXES;

const FETCH_RESOURCE_START = `${FETCH}_*_${START}`;
const FETCH_RESOURCE_ERROR = `${FETCH}_*_${ERROR}`;
const FETCH_RESOURCE_SUCCESS = `${FETCH}_*_${SUCCESS}`;

describe('makeFetchLifeCycle()', () => {
  const entitiesPath = 'byId';
  const defaultProps = { entitiesPath };

  assertOutputIsFunction(() => makeFetchLifeCycle(defaultProps));

  assertInitialStateReturnedOnInit(() => makeFetchLifeCycle(defaultProps));

  assertStateReturnedOnInvalidActionType(
    () => makeFetchLifeCycle(defaultProps),
    FETCH
  );

  assertPendingStateSet(
    (testEntitiesPath: string) =>
      makeFetchLifeCycle({ ...defaultProps, entitiesPath: testEntitiesPath }),
    FETCH_RESOURCE_START,
    'isFetching'
  );

  assertErrorsSet(
    (testEntitiesPath: string) =>
      makeFetchLifeCycle({ ...defaultProps, entitiesPath: testEntitiesPath }),
    FETCH_RESOURCE_ERROR
  );

  describe('outcomes with the *_SUCCESS action.type', () => {
    const referenceId = '234';
    const payload = {
      id: referenceId,
      name: 'foo',
    };
    const fetchSuccessAction = {
      type: FETCH_RESOURCE_SUCCESS,
      payload,
    };

    it('sets the action.payload on a specific entity determined by the meta.referenceId', () => {
      const fetchReducer = makeFetchLifeCycle(defaultProps);
      const initialState = {
        [entitiesPath]: {},
      };
      const fetchSuccessActionWithMeta = {
        ...fetchSuccessAction,
        meta: { referenceId },
      };
      const nextState = fetchReducer(initialState, fetchSuccessActionWithMeta);
      const stateEntities = nextState[entitiesPath];

      expect(stateEntities).toHaveProperty(referenceId);
      expect(stateEntities[referenceId]).toEqual(payload);
    });

    it('sets the action.payload on a specific entity determined by the payload.id', () => {
      const fetchReducer = makeFetchLifeCycle(defaultProps);
      const initialState = {
        [entitiesPath]: {},
      };
      const nextState = fetchReducer(initialState, fetchSuccessAction);
      const stateEntities = nextState[entitiesPath];

      expect(stateEntities).toHaveProperty(referenceId);
      expect(stateEntities[referenceId]).toEqual(payload);
    });

    it('unsets errors and isFetching', () => {
      const fetchReducer = makeFetchLifeCycle(defaultProps);
      const initialState = {
        [entitiesPath]: {
          [referenceId]: {
            isFetching: true,
            errors: ['something went wrong'],
          },
        },
      };
      const nextState = fetchReducer(initialState, fetchSuccessAction);
      const stateEntities = nextState[entitiesPath];

      expect(stateEntities).not.toHaveProperty('errors');
    });
  });

  describe('batch responses', () => {
    it('sets the isFetching pending state at the root state level', () => {
      const fooReducer = makeFetchLifeCycle(defaultProps);
      const nextState = fooReducer({}, { type: FETCH_RESOURCE_START });
      expect(nextState.isFetching).toEqual(true);
    });

    it('sets errors at the root level', () => {
      const expectedErrors = ['something went wrong'];
      const fooReducer = makeFetchLifeCycle(defaultProps);
      const errorAction = {
        type: FETCH_RESOURCE_ERROR,
        errors: expectedErrors,
      };
      const nextState = fooReducer({}, errorAction);

      expect(nextState.isFetching).toEqual(false);
      expect(nextState.errors).toEqual(expectedErrors);
    });

    it('sets the action.payload at the entitiesPath', () => {
      const fooReducer = makeFetchLifeCycle(defaultProps);
      const successAction = {
        type: FETCH_RESOURCE_SUCCESS,
        payload: {
          '123': { id: '123', name: 'bar' },
          '234': { id: '234', name: 'baz' },
        },
      };
      const nextState = fooReducer({}, successAction);

      expect(nextState[entitiesPath]).toEqual(successAction.payload);
    });
  });
});
