# Redesert Action Types

`resourceApiActionTypesFactory` creates action types that
`redesert-resource-reducer`s automatically have cases for, and
`redesert-api-thunk`s automatically dispatches.

In general, they look like:

```js
`${API_ACTION_PREFIX}__${anyResource}__${API_LIFECYCLE_SUFFIX}`;
```

# API Action Prefixes

These are meant to mirror REST actions towards a service endpoint. In general:

* **REST Action** - **`redesert-api-action-type`**
* `GET` - `FETCH__*`
* `POST` - `CREATE-__*`
* `PUT`/`PATCH` - `UPDATE__*`
* `DELETE` - `REMOVE__*`

These will let us create consistently prefixed action types, no matter what
the resource (\*) is. This allows us to predictably know when and what
API action is broadcasted, and create general state transformations based on
specific REST actions. This is how we can re-use the same `fetch*`, `create*`,
`update*`, and `remove*` reducers no matter what the resource is.

To note, `redesert-resource-reducer`s initially guard against actions that do
not contain the `resource` name within the type, which is how the redcuers know
how to distinguish which actions to act upon or not.

# API Lifecycle Suffixes

All network requests have a basic logic flow of:

* `*__START` a network request. Signifies the request is in flight
* `*__SUCCESS` response from the endpoint (success)
* `*__FAILURE` response from the endpoint (error)

Of course there can be other types of suffixes (maybe `*__IN_PROGRESS` for
example). But in general the above three is the assumption, no matter what type
of API action is dispatched.

Because we have predictable API lifecycle suffixes, we can do two things:

1.  Create a light wrapper around our network requesting modules that
    auto-dispatches these lifecycle actions (`redesert-api-thunk`)
2.  Within reducers, we can listen to these life cycles and perform general state
    transformations to during each action of an API request lifecycle

Both can be resource agnostic. `redesert-api-thunk` will accept a
`baseActionType`, which contains information about the API action type and the
resource. It will then use that base type and dispatch suffixed variants, based
on where the network request is in the lifecycle. On the other side of things,
`redesert-resource-reducers` have cases for these suffixes in each API reducer
and performs general state updates based on the status of the API request.
