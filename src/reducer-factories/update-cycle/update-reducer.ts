import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import merge from 'lodash.merge';
import set from 'lodash.set';
import unset from 'lodash.unset';

import { Action } from './../../actions/type-definitions';
import { ReducerConfig, ReduxSliceState } from './../type-definitions';
import {
  isValidActionType,
  API_ACTION_PREFIXES,
  API_LIFECYCLE_SUFFIXES,
} from '../../actions';

function updateReducerFactory({ entitiesPath }: ReducerConfig): Function {
  return (state: ReduxSliceState, action: Action): ReduxSliceState => {
    const { type, payload, errors, meta } = action;

    if (!isValidActionType(API_ACTION_PREFIXES.UPDATE, type)) return state;

    const nextState = cloneDeep(state);
    const referenceId =
      meta && meta.referenceId ? meta.referenceId.toString() : null;

    if (referenceId === null) {
      throw new Error(`A ${API_ACTION_PREFIXES.UPDATE} action type was called
        without a meta.referenceId. It is a required attribute to determine
        which entity to update.

        Current @meta value passed: ${meta}
      `);
    }
    const attributesPath = [entitiesPath, referenceId];

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.START)) {
      return set(nextState, [...attributesPath, 'isUpdating'], true);
    }

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.ERROR)) {
      set(nextState, [...attributesPath, 'isUpdating'], false);
      return set(nextState, [...attributesPath, 'errors'], errors);
    }

    if (type.endsWith(API_LIFECYCLE_SUFFIXES.SUCCESS)) {
      set(nextState, [...attributesPath, 'isUpdating'], false);
      unset(nextState, [...attributesPath, 'errors']);
      merge(get(nextState, attributesPath), payload);

      return nextState;
    }

    return state;
  };
}

export default updateReducerFactory;
