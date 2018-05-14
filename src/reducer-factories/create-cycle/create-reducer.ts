import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import unset from 'lodash.unset';

import { ReducerConfig, ReduxSliceState } from './../type-definitions';
import {
  Action,
  API_ACTION_PREFIXES,
  API_LIFECYCLE_SUFFIXES,
  isValidActionType,
} from '../../actions';

function makeCreateReducer({ entitiesPath }: ReducerConfig): Function {
  return (state: ReduxSliceState, action: Action): ReduxSliceState => {
    const { type, payload, errors } = action;

    if (!isValidActionType(API_ACTION_PREFIXES.CREATE, type)) return state;

    const nextState = cloneDeep(state);

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.FAILURE)) {
      return set(nextState, 'errors', errors);
    }

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.SUCCESS)) {
      const referenceId: string = payload.id.toString();
      const attributePath: string[] = [entitiesPath, referenceId];

      unset(nextState, 'errors');
      return set(nextState, attributePath, payload);
    }

    return state;
  };
}

export default makeCreateReducer;
