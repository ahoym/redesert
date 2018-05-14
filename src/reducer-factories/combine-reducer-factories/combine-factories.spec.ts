import combineFactories from './combine-factories';

describe('combineFactories()', () => {
  const mockReducer = (state: any) => state;
  const mockReducerFactory = (config: any) => mockReducer;
  const entitiesPath = 'byId';
  const defaultReducerFactories = {
    makeCreateLifeCycle: mockReducerFactory,
    makeFetchLifeCycle: mockReducerFactory,
    makeDeleteLifeCycle: mockReducerFactory,
    makeUpdateLifeCycle: mockReducerFactory,
  };
  const customReducerFactories = {};
  const defaultProps = {
    defaultReducerFactories,
    entitiesPath,
    customReducerFactories,
  };

  it('returns an array of reducer functions', () => {
    const numberOfReducers = Object.keys(defaultReducerFactories).length;
    const reducers = combineFactories(defaultProps);

    expect(reducers).toBeInstanceOf(Array);
    expect(reducers[0]).toBeInstanceOf(Function);
    expect(reducers.length).toEqual(numberOfReducers);
  });

  it('adds customReducerFactories', () => {
    const numberOfReducers = Object.keys(defaultReducerFactories).length;
    const reducers = combineFactories({
      ...defaultProps,
      customReducerFactories: { foo: mockReducerFactory },
    });

    expect(reducers.length).toEqual(numberOfReducers + 1);
  });

  it('calls the reducer factories with a reducerConfig', () => {
    const reducerFactoryMock = jest.fn();
    combineFactories({
      ...defaultProps,
      customReducerFactories: { foo: reducerFactoryMock },
    });

    expect(reducerFactoryMock).toBeCalledWith({ entitiesPath });
  });

  it('combines customReducerFactories on top of defaultReducerFactories', () => {
    const overrideFn = jest.fn();
    combineFactories({
      ...defaultProps,
      customReducerFactories: {
        makeFetchLifeCycle: overrideFn, // Override key life cycle from defaults
      },
    });

    expect(overrideFn).toBeCalled();
  });
});
