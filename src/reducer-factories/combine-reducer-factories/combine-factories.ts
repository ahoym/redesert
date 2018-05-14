import {
  CombinedReducerConfiguration,
  ReducerConfig,
  ReducerFactory,
} from '../type-definitions';

function combineFactories({
  customReducerFactories,
  defaultReducerFactories,
  entitiesPath,
}: CombinedReducerConfiguration): Function[] {
  const allFactories: ReducerFactory = Object.assign(
    {},
    defaultReducerFactories,
    customReducerFactories
  );
  const reducerConfig: ReducerConfig = {
    entitiesPath,
  };
  const {
    createReducerFactory,
    fetchReducerFactory,
    removeReducerFactory,
    updateReducerFactory,
    ...customFactories
  } = allFactories;

  const allReducers: Function[] = Object.keys(customFactories).reduce(
    (reducers: Function[], reducerName: string) => {
      const reducerFactory = customFactories[reducerName];
      return [...reducers, reducerFactory(reducerConfig)];
    },
    []
  );
  allReducers.push(createReducerFactory(reducerConfig));
  allReducers.push(fetchReducerFactory(reducerConfig));
  allReducers.push(removeReducerFactory(reducerConfig));
  allReducers.push(updateReducerFactory(reducerConfig));

  return allReducers;
}

export default combineFactories;
