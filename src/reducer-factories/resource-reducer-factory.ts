import isEqual from 'lodash.isequal';
import combineFactories from './combine-reducer-factories/combine-factories';
import { ReduxSliceState, MakeReducerConfiguration } from './type-definitions';
import { Action } from '../actions/type-definitions';

const placeholderDefaultReducer = (state: ReduxSliceState) => state;
const placeholderDefaultReducerFactories = {
  makeCreateLifeCycle: () => placeholderDefaultReducer,
  makeFetchLifeCycle: () => placeholderDefaultReducer,
  makeDeleteLifeCycle: () => placeholderDefaultReducer,
  makeUpdateLifeCycle: () => placeholderDefaultReducer,
};

function resourceReducerFactory({
  customReducerFactories,
  defaultReducerFactories = placeholderDefaultReducerFactories,
  entitiesPath,
  externalActionTypes = [],
  initialState,
  resource,
}: MakeReducerConfiguration): Function {
  const allReducers = combineFactories({
    entitiesPath,
    customReducerFactories,
    defaultReducerFactories,
  });

  return (
    state: ReduxSliceState = initialState,
    action: Action
  ): ReduxSliceState => {
    const actionType: string = action.type;
    const isValidActionType: boolean =
      actionType.includes(resource) || externalActionTypes.includes(actionType);

    if (!isValidActionType) return state;

    for (let index in allReducers) {
      const reducer: Function = allReducers[index];
      const newState = reducer(state, action);

      if (!isEqual(state, newState)) return newState;
    }

    return state;
  };
}

export default resourceReducerFactory;
