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

export default API_ACTION_PREFIXES;
