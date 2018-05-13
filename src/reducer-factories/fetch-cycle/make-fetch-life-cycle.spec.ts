import makeFetchLifeCycle from './make-fetch-life-cycle';

describe('makeFetchLifeCycle()', () => {
  const basePath = 'byId';
  const dataNormalizer = (value: any) => value;

  it('creates a function', () => {
    const fetchReducer = makeFetchLifeCycle({ basePath, dataNormalizer });
    expect(fetchReducer).toBeInstanceOf(Function);
  });

  it('returns the passed in state on the INIT action', () => {
    const fetchReducer = makeFetchLifeCycle({ basePath, dataNormalizer });
    const expectedState = {};
    const action = {
      type: '@@INIT',
    };
    const value = fetchReducer(expectedState, action);

    expect(value).toEqual(expectedState);
  });
});
