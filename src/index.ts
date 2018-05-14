import resourceReducerFactory from './reducer-factories/resource-reducer-factory';
import defaultReducerFactories from './reducer-factories/default-factories';
import { MakeReducerConfiguration } from './reducer-factories/type-definitions';

export const makeResourceReducer = (
  config: MakeReducerConfiguration
): Function => resourceReducerFactory({ defaultReducerFactories, ...config });

export { resourceReducerFactory };
