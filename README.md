# Redesert

[![Build Status](https://travis-ci.com/ahoym/redesert.svg?branch=master)](https://travis-ci.com/ahoym/redesert)
<a href="https://codeclimate.com/github/ahoym/redesert/maintainability"><img src="https://api.codeclimate.com/v1/badges/6092506aae88ba28bf0f/maintainability" /></a>
<a href="https://codeclimate.com/github/ahoym/redesert/test_coverage"><img src="https://api.codeclimate.com/v1/badges/6092506aae88ba28bf0f/test_coverage" /></a>

Redux, but the boiler plate done for you. `redesert` is a set of higher order functions that automatically generate reducers, selectors, actions, and action creators mainly geared for handling REST API request cycles.

**TL;DR** The state slices output from the reducer is strictly opinionated, but because of that we can auto-generate other portions of the data life cycle.

#### Table of Contents

* [Installation][installation]
* [Basic Example][basicexample]
* [In action, inside example projects][exampleusages]
* [How does it work?][howitworks]

## Installation

[installation]: #installation

```
npm install --save redesert
```

or

```
yarn add redesert
```

## Basic Example

[basicexample]: #basic-example

```javascript
import {
  apiThunk,
  makeResourceReducer,
  makeResourceSelectors,
  resourceApiActionTypesFactory,
} from 'redesert';

// Resources are usually a model from your backend
const resource = 'foo';
// Create action types that redesert functions understand and expect
const fooApiActionTypes = resourceApiActionTypesFactory(resource);

// Syntax for action creators that are already bound to dispatch in Containers
const fetchFoos = () =>
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
/*
Ouputs a state that looks like:

[resource]: {
  [entitiesPath]: {
    [entity.id]: entity
  },
  errors?: any
  isFetching: boolean // Only for the status of GET'ing a collection
}
*/
```

## In action, inside example projects:

[exampleusages]: #in-action-inside-example-projects

* Add link to pokemans

## How does it work?

[howitworks]: #how-does-it-work

* `resourceApiActionTypesFactory` creates action types that generated reducers
  automatically have cases for, and `apiThunk` automatically dispatches
* `apiThunk` follows the basic network request logic flow of:
  * `*__START` a network request. Signifies the request is in flight
  * `*__SUCCESS` response from the endpoint (success)
  * `*__FAILURE` response from the endpoint (error)
* `makeResourceReducer`/`resourceReducerFactory` creates a reducer that has
  cases for the above three request life cycle suffixes
  * The resource reducer will only parse action types of the passed in
    `resource`, or any action types defined in `externalActionTypes`
  * Each REST action has its own cases for the suffixes. This yields generic
    action types that look like: `<API_ACTION>__resource__<SUFFIX>`
  * The reducer outputs an expected state data structure
* `makeResourceSelectors` creates selectors that traverse the expected state and
  returns commonly accessed data. These selectors can also be used (through
  `reselect`) to compose more specific selectors for your application
