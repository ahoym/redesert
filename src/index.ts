import apiThunk from './api-thunk-factory/api-thunk';
import defaultReducerFactories from './reducer-factories/default-factories';
import resourceReducerFactory from './reducer-factories/resource-reducer-factory';
import selectorsFactory from './selector-factories/base-selectors';
import { resourceApiActionTypesFactory } from './actions';
import { DefaultReducerFactories } from './reducer-factories/type-definitions';

const entitiesPath = 'byId';

type MakeResourceReducerConfig = {
  entitiesPath: string;
  initialState?: any;
  defaultReducerFactories?: DefaultReducerFactories;
  resource: string;
};

const makeResourceReducer = (config: MakeResourceReducerConfig): Function =>
  resourceReducerFactory({
    defaultReducerFactories,
    entitiesPath,
    ...config,
  });

type MakeResourceSelectorsConfig = {
  entitiesPath: string;
  resource: string;
};

const makeResourceSelectors = (config: MakeResourceSelectorsConfig) =>
  selectorsFactory({ entitiesPath, ...config });

export {
  apiThunk,
  makeResourceReducer,
  makeResourceSelectors,
  resourceApiActionTypesFactory,
  resourceReducerFactory,
  selectorsFactory,
};
