import cloneDeep from 'lodash.clonedeep';

const testEntitiesPath = 'byId';
const referenceId = '3';
const MOCK_INITIAL_STATE = {
  [testEntitiesPath]: {
    [referenceId]: {
      id: referenceId,
      name: 'foobar',
    },
  },
};
const mockState = () => cloneDeep(MOCK_INITIAL_STATE);

export const assertOutputIsFunction = (output: Function) => {
  it('returns a function', () => {
    expect(output()).toBeInstanceOf(Function);
  });
};

export const assertInitialStateReturnedOnInit = (output: Function) => {
  it('returns state on the @@INIT action.type', () => {
    const initAction = { type: '@@INIT' };
    const reducer = output();
    const nextState = reducer(mockState(), initAction);
    expect(nextState).toEqual(mockState());
  });
};

export const assertStateReturnedOnInvalidActionType = (
  output: Function,
  prefix: string
) => {
  const reducer = output();

  it(`returns state if the action.type doesn't start with ${prefix}`, () => {
    const invalidPrefixAction = { type: 'NAMESPACED_PREFIX_*' };
    const nextState = reducer(mockState(), invalidPrefixAction);
    expect(nextState).toEqual(mockState());
  });

  it(`returns state if the action.type doesn't end with one of the API_LIFECYCLE_SUFFIXES`, () => {
    const invalidSuffixAction = { type: `${prefix}_*_INVALID_SUFFIX` };
    const nextState = reducer(mockState(), invalidSuffixAction);
    expect(nextState).toEqual(mockState());
  });
};

export const assertPendingStateSet = (
  output: Function,
  actionType: string,
  pendingState: string
) => {
  it(`sets ${pendingState} on the *_START action.type`, () => {
    const reducer = output(testEntitiesPath);
    const initialState = reducer(mockState(), { type: '@@INIT' });
    expect(initialState).toEqual(mockState());

    const pendingAction = {
      type: actionType,
      meta: { referenceId },
    };
    const nextState = reducer(mockState(), pendingAction);
    const testEntity = nextState[testEntitiesPath][referenceId];

    expect(testEntity).toHaveProperty(pendingState);
  });
};

export const assertErrorsSet = (
  output: Function,
  actionType: string,
  pendingState: string
) => {
  it(`sets errors on the *_FAILURE action.type`, () => {
    const reducer = output(testEntitiesPath);
    const initialState = reducer(mockState(), { type: '@@INIT' });
    expect(initialState).toEqual(mockState());

    const failureAction = {
      type: actionType,
      meta: { referenceId },
      errors: ['something went wrong!'],
    };
    const nextState = reducer(mockState(), failureAction);
    const testEntity = nextState[testEntitiesPath][referenceId];

    expect(testEntity[pendingState]).toEqual(false);
    expect(testEntity).toHaveProperty('errors');
  });
};
