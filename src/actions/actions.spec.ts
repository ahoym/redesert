import API_LIFECYCLE_SUFFIXES from './api-lifecycle-suffixes';
import isValidActionType from './is-valid-action-type';

describe('isValidActionType()', () => {
  const reducerNameSpace = 'FETCH_';

  it("is false for actionTypes that don't start with the reducerNamespace", () => {
    const actionType = `CREATE_foo_${API_LIFECYCLE_SUFFIXES.START}`;
    expect(isValidActionType(reducerNameSpace, actionType)).toEqual(false);
  });

  it("is false for actionTypes that don't end in one of the API_LIFECYCLE_SUFFIXES", () => {
    const actionType = 'CREATE_foo_BLARGH';
    expect(isValidActionType(reducerNameSpace, actionType)).toEqual(false);
  });

  it('is true only if the actionType has a valid namespace and suffix', () => {
    Object.keys(API_LIFECYCLE_SUFFIXES).forEach(suffix => {
      const actionType = `${reducerNameSpace}_foo_${suffix}`;
      expect(isValidActionType(reducerNameSpace, actionType)).toEqual(true);
    });
  });
});
