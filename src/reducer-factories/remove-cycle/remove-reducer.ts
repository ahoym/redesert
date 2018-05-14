import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import unset from 'lodash.unset';

import { ReducerConfig, ReduxSliceState } from './../type-definitions';
import {
  Action,
  isValidActionType,
  API_ACTION_PREFIXES,
  API_LIFECYCLE_SUFFIXES,
} from '../../actions';

function removeReducerFactory({ entitiesPath }: ReducerConfig): Function {
  return (state: ReduxSliceState, action: Action): ReduxSliceState => {
    const { type, errors, meta } = action;

    if (!isValidActionType(API_ACTION_PREFIXES.REMOVE, type)) return state;
    const newState = cloneDeep(state);
    const referenceId =
      meta && meta.referenceId ? meta.referenceId.toString() : null;

    if (referenceId === null) {
      throw new Error(`A ${API_ACTION_PREFIXES.REMOVE} action type was called
        without a meta.referenceId. It is a required attribute to determine
        which entity to remove.

        Current @meta value passed: ${meta}
      `);
    }

    const attributesPath = [entitiesPath, referenceId];

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.START)) {
      return set(newState, [...attributesPath, 'isRemoving'], true);
    }

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.ERROR)) {
      set(newState, [...attributesPath, 'isRemoving'], false);
      return set(newState, [...attributesPath, 'errors'], errors);
    }

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.SUCCESS)) {
      unset(newState, attributesPath);
      return newState;
    }

    return state;
  };
}

export default removeReducerFactory;
