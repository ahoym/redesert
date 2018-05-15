import resourceReducerFactory from './reducer-factories/resource-reducer-factory';
import defaultReducerFactories from './reducer-factories/default-factories';
import { DefaultReducerFactories } from './reducer-factories/type-definitions';

const entitiesPath = 'byId';

type Config = {
  entitiesPath: string;
  initialState?: any;
  defaultReducerFactories?: DefaultReducerFactories;
  resource: string;
};

export const makeResourceReducer = (config: Config): Function =>
  resourceReducerFactory({
    defaultReducerFactories,
    entitiesPath,
    ...config,
  });

export { resourceReducerFactory };
