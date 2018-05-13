import set from 'lodash.set';
import { ReduxSliceState } from '../type-definitions';
import {
  API_LIFECYCLE_SUFFIXES,
  API_ACTION_PREFIXES,
  Action,
} from '../../actions';

const { START, ERROR, SUCCESS } = API_LIFECYCLE_SUFFIXES;

type Props = {
  basePath: string;
  dataNormalizer: Function;
};

const makeFetchLifeCycle = ({ basePath, dataNormalizer }: Props) => {
  const fetchLifeCycleCases = (state: ReduxSliceState, action: Action) => {
    const { errors, meta, payload, type } = action;

    if (!type.startsWith(API_ACTION_PREFIXES.FETCH)) return state;

    const referenceId: string | null =
      meta && meta.referenceId ? meta.referenceId.toString() : null;
    let pendingPath: string[];

    if (!referenceId) {
      pendingPath = ['isFetching'];
    } else {
      pendingPath = [basePath, referenceId, 'isFetching'];
    }

    if (type.endsWith(START)) {
      return set(state, pendingPath, true);
    }

    if (type.endsWith(ERROR)) {
      const newState = { ...state, errors };
      return set(newState, pendingPath, false);
    }

    if (type.endsWith(SUCCESS)) {
      const isCollection = Array.isArray(payload);
      let attributes;
      let path: string[] = [basePath];

      if (isCollection) {
        attributes = dataNormalizer(payload);
      } else {
        // The payload is for a single fetched entity
        attributes = payload || {};
        // Existence of a referenceId means the developer has a hard override
        path = [basePath, referenceId || attributes.id.toString()];
      }

      const { errors, ...oldState } = state;
      const newState = set(oldState, pendingPath, false);
      return set(newState, path, attributes);
    }

    return state;
  };

  return fetchLifeCycleCases;
};

export default makeFetchLifeCycle;
