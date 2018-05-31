# redesert API Thunk

`redesert-api-thunk` creates a redux-thunk that automatically dispatches actions
of an API life cycle.

This library is agnostic of whatever network request library your application
uses, or what your API response data structures look like.

The only requirement is that this libarary does operate under the assumption
that your app already has a `redux` store set up to handle `thunk` middleware.

API life cycles have a basic logic flow of:

* `*__START` a network request. Signifies the request is in flight
* `*__SUCCESS` response from the endpoint (success)
* `*__FAILURE` response from the endpoint (error)

And API thunk will dispatch them at relevant points of the network request.
See `redesert-api-action-types` for more information, and for generating action
types that are compatible with `redesert-api-thunk`.

`redesert-resource-reducer` will generate a reducer that automatically has
action type handling cases for actions dispatched from `redesert-api-thunk`.

# Example Usage with other `redesert` libraries

```js
import apiThunk from 'redesert-api-thunk';
import resourceApiActionTypesFactory from 'redesert-api-action-types';
import makeResourceReducer from 'redesert-resource-reducer';

const resource = 'foo';
const fooApiActions = resourceApiActionTypesFactory(resource);

function fetchFoos(data) {
  return apiThunk({
    baseActionType: fooApiActions.FETCH,
    networkRequest: makeNetworkRequest('/api/foos', data),
    successNormalizer,
    failureNormalizer,
  });
}

const fooReducer = makeResourceReducer({ resource });

/*
Assuming the data structures coming from your endpoints are generally the same,
we recommend placing all functions below in an external file.

This is so they can be imported in apiThunks for your other resources, they are
easier to unit test, and provide a clear distinction between thunking logic and
network requesting + normalization logic.

This will allow for more painless migrations, should you choose to use
redux-sagas instead of thunks, or any other action dispatching library.

*/
function makeNetworkRequest(endpoint, data) {
  // Or whatever AJAX library your app uses
  return fetch(endpoint, {
    data,
    // headers, other configured things for network requests
  });
}

function successNormalizer(apiResponse) {
  // Use this function to normalize data from a successful response from your endpoint
  return apiResponse;
}

function failureNormalizer(apiError) {
  // Use this function to normalize data from a failed response from endpoint
  return apiError;
}
```

# API Documentation

All properties denoted with a `?` are optional.

### `baseActionType: string`

`redesert-api-thunk` will suffix the `baseActionType` with API life cycle
suffixes from `redesert-api-action-types`.

If using this library without `redesert-resource-reducer`, have cases for:

```js
switch (action.type) {
  case `${baseActionType}__START`:

  case `${baseActionType}__SUCESS`:

  case `${baseActionType}__FAILURE`:
}
```

### `networkRequest: Function`

Function that makes the actual ajax request from your application. This library does
nothing else but call this parameter, so the consumer has full control over
their network requesting libarary of choice.

We recommend defining this function outside of `apiThunk` consumption, so that
it decouples network request logic from thunking logic. This will allow you to
use your network request function externally from thunking if needed, and makes
it easier to migrate to another action dispatching libarary if needed.

### `failureNormalizer?: Function`

Function for normalizing data structures returned from a failed response from
your backend. Useful for munging the data into a form that your reducers can dependably expect.

### `successNormalizer?: Function`

Function for normalizing data structures returned from a failed response from
your backend. Useful for munging the data into a form that your reducers can dependably expect.

### `meta?: object`

Object that is included in all actions dispatched by `redesert-api-thunk`.

The most notable property that it is used for is for is to provide a reference ID
for reducers to know where to update single data entities. eg:

```js
case `UPDATE__RESOURCE__SUCCESS`: {
    const { meta } = action;
    const { referenceId } = meta;

    return {
        ...state,
        byId: {
            ...state.byId
            [referenceId]: {
               ...state.byId[referenceId],
               ...action.payload,
            }
        }
    }
}
```

Other example usages can include time logging or a snapshotted current state
(for rollbacks). This property is meant to give the developer a single
interface to interact with for providing extra data to special cases in
your application's reducers, so it's up to the developer to decide what they
want to pass along.
