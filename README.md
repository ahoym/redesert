# Redesert

[![Build Status](https://travis-ci.com/ahoym/redesert.svg?branch=master)](https://travis-ci.com/ahoym/redesert)
<a href="https://codeclimate.com/github/ahoym/redesert/maintainability"><img src="https://api.codeclimate.com/v1/badges/6092506aae88ba28bf0f/maintainability" /></a>
<a href="https://codeclimate.com/github/ahoym/redesert/test_coverage"><img src="https://api.codeclimate.com/v1/badges/6092506aae88ba28bf0f/test_coverage" /></a>

Redux, but the boiler plate done for you. `redesert` is a set of higher order functions that automatically generate reducers, selectors, actions, and action creators.

## Basic Example

```js
import {
  apiThunk,
  makeResourceReducer,
  makeResourceSelectors,
  resourceApiActionTypesFactory,
} from 'redesert';

const resource = 'foo';
const fooApiActionTypes = resourceApiActionTypesFactory(resource);

const fetchFoos = () => dispatch =>
  apiThunk({
    baseActionType: fooApiActionTypes.FETCH,
    networkRequest: () => fetch('/api/foos'), // Or whatever request library
    sucessNormalizer: someFn, // Normalize the response from the endpoint
    failureNormalizer: someFn, // Normalize an error from the endpoint
  });

// Dynamically generated base selectors, can compose more selectors from these
const {
  getFooEntities,
  getFooById,
  getFooErrors,
  getFooErrorsByid,
  getAreFooEntitiesFetching,
  getIsFooFetching,
  getIsFooUpdating,
  getIsFooRemoving,
} = makeResourceSelectors({ resource });

// Handles all basic CRUD action types, dispatched from apiThunk
const fooReducer = makeResourceReducer({ resource });
```
