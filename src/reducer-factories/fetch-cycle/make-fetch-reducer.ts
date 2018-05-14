import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import unset from 'lodash.unset';

import { ReduxSliceState, ReducerConfig } from '../type-definitions';
import {
  API_LIFECYCLE_SUFFIXES,
  API_ACTION_PREFIXES,
  Action,
  isValidActionType,
} from '../../actions';

const { START, ERROR, SUCCESS } = API_LIFECYCLE_SUFFIXES;

function makeFetchLifeCycle({ entitiesPath }: ReducerConfig): Function {
  const fetchLifeCycleCases = (
    state: ReduxSliceState,
    action: Action
  ): ReduxSliceState => {
    const { errors, meta, payload, type } = action;

    if (!isValidActionType(API_ACTION_PREFIXES.FETCH, type)) return state;

    const newState = cloneDeep(state);
    const referenceId: string | null =
      meta && meta.referenceId ? meta.referenceId.toString() : null;
    let attributePath: string[]; // Determine where to set pending state

    if (!referenceId) {
      // Assume batch fetch
      attributePath = [];
    } else {
      attributePath = [entitiesPath, referenceId];
    }

    if (type.endsWith(START)) {
      return set(newState, [...attributePath, 'isFetching'], true);
    }

    if (type.endsWith(ERROR)) {
      set(newState, [...attributePath, 'errors'], errors);
      return set(newState, [...attributePath, 'isFetching'], false);
    }

    if (type.endsWith(SUCCESS)) {
      const attributes: any = payload || {};
      let path: string[] = [entitiesPath];

      if (!!referenceId || attributes.id !== undefined) {
        // Use developer specified referenceId, to retain override
        path = [entitiesPath, referenceId || attributes.id.toString()];
        attributePath = path;
      }

      unset(newState, [...attributePath, 'errors']);
      set(newState, [...attributePath, 'isFetching'], false);
      return set(newState, path, attributes);
    }

    return state;
  };

  return fetchLifeCycleCases;
}

export default makeFetchLifeCycle;
