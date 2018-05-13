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
    makeCreateLifeCycle,
    makeFetchLifeCycle,
    makeDeleteLifeCycle,
    makeUpdateLifeCycle,
    ...customLifeCycles
  } = allFactories;

  const lifeCycleReducers: Function[] = Object.keys(customLifeCycles).reduce(
    (cycles: Function[], reducerName: string) => {
      const reducerFactory = customLifeCycles[reducerName];
      return [...cycles, reducerFactory(reducerConfig)];
    },
    []
  );
  lifeCycleReducers.push(makeCreateLifeCycle(reducerConfig));
  lifeCycleReducers.push(makeFetchLifeCycle(reducerConfig));
  lifeCycleReducers.push(makeDeleteLifeCycle(reducerConfig));
  lifeCycleReducers.push(makeUpdateLifeCycle(reducerConfig));

  return lifeCycleReducers;
}

export default combineFactories;
