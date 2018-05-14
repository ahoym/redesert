export interface ApiLifeCycleSuffixes {
  readonly START: '_START';
  readonly SUCCESS: '_SUCCESS';
  readonly ERROR: '_ERROR';
}

const API_LIFECYCLE_SUFFIXES: ApiLifeCycleSuffixes = {
  START: '_START',
  SUCCESS: '_SUCCESS',
  ERROR: '_ERROR',
};

export const ALL_API_LIFECYCLE_SUFFIXES: string[] = Object.keys(
  API_LIFECYCLE_SUFFIXES
);

export default API_LIFECYCLE_SUFFIXES;
