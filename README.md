**Disclaimer:**
The APIs **will** change to be more consistent in v1.0.0. By then we also hope to have destructured the library so that it is decoupled from `redux-thunk` and `reselect`, so that developers that may want to swap out parts of the redux cycle (like using sagas instead of thunks) with other libraries may do so.

# Redesert

[![Build Status](https://travis-ci.com/ahoym/redesert.svg?branch=master)](https://travis-ci.com/ahoym/redesert)
<a href="https://codeclimate.com/github/ahoym/redesert/maintainability"><img src="https://api.codeclimate.com/v1/badges/6092506aae88ba28bf0f/maintainability" /></a>
<a href="https://codeclimate.com/github/ahoym/redesert/test_coverage"><img src="https://api.codeclimate.com/v1/badges/6092506aae88ba28bf0f/test_coverage" /></a>

Redux, but the boiler plate DRY'ed up. Just define your `resource`. `redesert` is a set of higher order functions that automatically generate reducers, selectors, actions, and action creators mainly geared for handling REST API request cycles.

**TL;DR** The state slices output from the reducer is strictly opinionated but general. However, because of that we can auto-generate other portions of the data life cycle.

The state slice generally looks like this:

```js
/*
[resource]: {
  [entitiesPath]: {
    [entity.id]: {
      ...otherProps // Developer defines these
      isFetching: boolean, // Pending status for a GET for a single entity
      isCreating: boolean, // Pending status for a POST for a single entity
      isUpdating: boolean, // Pending status for a PUT/PATCH for a single entity
      isRemoving: boolean, // Pending status for a DELETE for a single entity
    }
  },
  errors?: any
  isFetching: boolean // Only for the status of GET'ing a collection
}
*/
```

#### Table of Contents

* [Installation][installation]
* [Basic Example][basicexample]
* [In action, inside example projects][exampleusages]
* [How does it work?][howitworks]

## Installation

[installation]: #installation

```
npm install --save redesert reselect redux-thunk
```

or

```
yarn add redesert reselect redux-thunk
```

## Basic Example

[basicexample]: #basic-example

Following the ["ducks" module pattern](https://github.com/erikras/ducks-modular-redux), this example puts all redux related logic
into a single file.

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
export const fetchFoos = () =>
  apiThunk({
    baseActionType: fooApiActionTypes.FETCH,
    networkRequest: () => fetch('/api/foos'), // Or whatever request library
    sucessNormalizer: someFn, // Normalize the response from the endpoint
    failureNormalizer: someFn, // Normalize an error from the endpoint
  });

// Dynamically generated base selectors, can compose more selectors from these.
export const {
  getFooEntities,
  getFooById,
  getFooErrors,
  getFooErrorsByid,
  getAreFooEntitiesFetching,
  getIsFooFetching,
  getIsFooUpdating,
  getIsFooRemoving,
} = makeResourceSelectors({ resource });

// Handles all basic CRUD action types, dispatched from apiThunk.
// Import and use in root reducer instantiation.
export const fooReducer = makeResourceReducer({ resource });
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

* **[Pokemans][pokemansroot]**. Sandbox side project that utilizes the open source [pokeapi](https://pokeapi.co/)
  * [Redux modules generated with redesert][redesertreduxmodules]
  * [Redesert Reducer combined as part of the root reducer][rootreducer]
  * [Selectors and action creators imported and used in the Container][otherusages]

[pokemansroot]: https://github.com/ahoym/pokemans
[redesertreduxmodules]: https://github.com/ahoym/pokemans/blob/master/src/modules/pokemon/pokemon.js
[rootreducer]: https://github.com/ahoym/pokemans/blob/master/src/reducers.js
[otherusages]: https://github.com/ahoym/pokemans/blob/master/src/features/Pokedex/PokemonViewer/PokemonViewerContainer.js

## How does it work?

[howitworks]: #how-does-it-work

#### [`resourceApiActionTypesFactory`](https://github.com/ahoym/redesert/tree/master/src/actions/README.md)

Creates action types that generated reducers automatically have cases for, and `apiThunk` automatically dispatches

#### [`apiThunk`](https://github.com/ahoym/redesert/tree/master/src/api-thunk-factory)

Composed of three distinct pieces of logic:

1.  It follows the basic network request logic flow of:
    * `*__START` a network request. Signifies the request is in flight
    * `*__SUCCESS` response from the endpoint (success)
    * `*__FAILURE` response from the endpoint (error)
    * Relevant actions pertaining to the above are dispatched throughout that flow
2.  Normalization of response bodies for success and failed cases
    * This is how developers control the data shape of entities within the redux store
3.  API requesting call
    * Allows `apiThunk` to be completely agnostic of what a developer's choice of request library is, or its configurations (such as headers, content types, etc)

#### [`makeResourceReducer`/`resourceReducerFactory`](https://github.com/ahoym/redesert/tree/master/src/reducer-factories/README.md)

Creates a reducer that has cases for the life cycle suffixes dispatched from `apiThunk`.

* The resource reducer will only parse action types of the passed in `resource`, or any action types defined in `externalActionTypes`
* Each REST action has its own cases for the suffixes. This yields generic action types that look like: `<API_ACTION>__resource__<SUFFIX>`
* The reducer outputs an expected strict state data structure layout

#### `makeResourceSelectors`

Creates `reselect` selectors that traverse the expected state and returns commonly accessed data.
These selectors can also be used (through `reselect`) to compose more specific selectors for your application.
