import camelCase from 'lodash.camelcase';
import capitalize from 'lodash.capitalize';
import { createSelector } from 'reselect';
import { ReduxSliceState } from './../reducer-factories/type-definitions';

const pascalize = (string: string) => capitalize(camelCase(string));

export type SelectorsFactoryConfig = {
  entitiesPath: string;
  resource: string;
};
type State = {
  [resource_name: string]: any;
};
type Options = {
  id: string;
};
export type SelectorFns = {
  [selector_name: string]: Function;
};

function selectorsFactory({
  entitiesPath,
  resource,
}: SelectorsFactoryConfig): SelectorFns {
  const resourceName = pascalize(resource);

  const getEntities = (state: State) => state[resource][entitiesPath];
  const getId = (_state: State, { id }: Options) => id;

  const getEntityById = createSelector(
    getEntities,
    getId,
    (entities, id) => entities[id]
  );

  const getFirstEntity = createSelector(getEntities, entities => {
    const firstKey = Object.keys(entities)[0];
    return entities[firstKey];
  });

  const getSliceErrors = (state: ReduxSliceState) => state[resource].errors;

  const areEntitiesFetching = (state: ReduxSliceState) =>
    !!state[resource].isFetching;

  const getEntityErrorsById = createSelector(
    getEntityById,
    entity => entity && entity.errors
  );

  const isEntityFetching = createSelector(
    getEntityById,
    entity => entity && !!entity.isFetching
  );

  const isEntityUpdating = createSelector(
    getEntityById,
    entity => entity && !!entity.isUpdating
  );

  const isEntityRemoving = createSelector(
    getEntityById,
    entity => entity && !!entity.isRemoving
  );

  return {
    [`get${resourceName}Entities`]: getEntities,
    [`get${resourceName}ById`]: getEntityById,
    [`getCurrent${resourceName}`]: getFirstEntity,
    [`get${resourceName}Errors`]: getSliceErrors,
    [`get${resourceName}ErrorsById`]: getEntityErrorsById,
    [`getAre${resourceName}EntitiesFetching`]: areEntitiesFetching,
    [`getIs${resourceName}Fetching`]: isEntityFetching,
    [`getIs${resourceName}Updating`]: isEntityUpdating,
    [`getIs${resourceName}Removing`]: isEntityRemoving,
  };
}

export default selectorsFactory;
