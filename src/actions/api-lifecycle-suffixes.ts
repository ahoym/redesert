export interface ApiLifeCycleSuffixes {
  readonly START: '_START';
  readonly SUCCESS: '_SUCCESS';
  readonly FAILURE: '_FAILURE';
}

const API_LIFECYCLE_SUFFIXES: ApiLifeCycleSuffixes = {
  START: '_START',
  SUCCESS: '_SUCCESS',
  FAILURE: '_FAILURE',
};

export const ALL_API_LIFECYCLE_SUFFIXES: string[] = Object.keys(
  API_LIFECYCLE_SUFFIXES
);

export default API_LIFECYCLE_SUFFIXES;
