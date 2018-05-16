export interface ApiActionPrefixes {
  readonly FETCH: 'FETCH_';
  readonly CREATE: 'CREATE_';
  readonly UPDATE: 'UPDATE_';
  readonly REMOVE: 'REMOVE_';
}

const API_ACTION_PREFIXES: ApiActionPrefixes = {
  FETCH: 'FETCH_',
  CREATE: 'CREATE_',
  UPDATE: 'UPDATE_',
  REMOVE: 'REMOVE_',
};

export function resourceApiActionTypesFactory(resource: string) {
  return {
    FETCH: `${API_ACTION_PREFIXES.FETCH}_${resource}`,
    CREATE: `${API_ACTION_PREFIXES.CREATE}_${resource}`,
    UPDATE: `${API_ACTION_PREFIXES.UPDATE}_${resource}`,
    REMOVE: `${API_ACTION_PREFIXES.REMOVE}_${resource}`,
  };
}

export default API_ACTION_PREFIXES;
