import resourceReducerFactory from './reducer-factories/resource-reducer-factory';
import defaultReducerFactories from './reducer-factories/default-factories';
import { MakeReducerConfiguration } from './reducer-factories/type-definitions';

const entitiesPath = 'byId';

export const makeResourceReducer = (
  config: MakeReducerConfiguration
): Function =>
  resourceReducerFactory({ defaultReducerFactories, entitiesPath, ...config });

export { resourceReducerFactory };
