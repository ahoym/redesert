export interface ReducerFactory {
  [factory_name: string]: Function;
}

export interface ReduxSliceState {
  [other_properties: string]: any;
  errors?: object;
}

export interface ReducerConfig {
  entitiesPath: string;
}

export interface DefaultReducerFactories {
  makeCreateLifeCycle: Function;
  makeFetchLifeCycle: Function;
  makeDeleteLifeCycle: Function;
  makeUpdateLifeCycle: Function;
}

export interface CombinedReducerConfiguration {
  customReducerFactories?: ReducerFactory;
  defaultReducerFactories: DefaultReducerFactories;
  entitiesPath: string;
}

export interface MakeReducerConfiguration {
  customReducerFactories?: ReducerFactory;
  defaultReducerFactories?: DefaultReducerFactories;
  entitiesPath: string;
  externalActionTypes?: string[];
  initialState?: any;
  resource: string;
}
