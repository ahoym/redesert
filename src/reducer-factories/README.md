# `resource-reducer-factory`

Creates a reducer that has cases for basic CRUD operations and applies resource
agnostic general state modifications. A state slice generated from a resource
reducer generally looks like:

```js
{
    [entitiesPath]: {
        [id]: Entity,
        [another_id]: {
            ...otherAttributes,
            isFetching: boolean,
            isUpdating: boolean,
            isRemoving: boolean,
        }
    },
    errors: any,
    isFetching: boolean, // Signifies status of collection GET
}
```

However there are multiple points for extension or overrides so that the
developer can get achieve the functionality and state shape they want.

# How it works in general

Reducers created from `resource-reducer-factory` can be resource agnostic
because we specify the `resource` that we're creating the reducer for at instantiation.

This allows the reducer to filter out action types that do not pertain to the
resource. (Note, in `redux`, all actions are passed to all reducers. This is
how multiple reducers can act upon the same action type, and why a default
return state is necessary for all reducers.)

However if there are external action types that we want our reducer
to handle, these can be whitelisted through `externalActionTypes` and having a
custom case inside a custom reducer factory.

The resource agnostic nature of action types works two fold. In additon to
filtering by resource, we can also have resource agnostic state modifications.

Instead of capturing specific action types and handling each individually, we
can capture classes of action types and perform relevant operations per class.
For example, this:

```js
switch (action.type) {
  case 'UPDATE__myResource__SUCCESS': {
    // Handle this specifically
  }
}
```

Becomes:

```js
// Filter out non UPDATE action types
if (!action.type.startsWith('UPDATE__')) return state;

if (action.type.endsWith('__SUCCESS')) {
  // Merge deep new attributes with old attributes
}
```

Which becomes more and more DRYer as apps accrue more resource models. Another
major benefit is that our unit testable surface area is greatly reduced:
instead of having specs for individual cases that often look very similar, we
unit test the entire class of action type handlings, which will hold no matter
how many resources are created from these cases.

While this increases the magic, it increases developer productivity by
extracting away the need to write specs that often look the same (because of
same state modifications). We encourage developers to fully understand the
"under the hood" mechanisms though, so that individuals can ascertain whether
this library provides benefits that developers may want.
