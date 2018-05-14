import createReducerFactory from '../create-cycle/create-reducer';
import fetchReducerFactory from '../fetch-cycle/fetch-reducer';
import removeReducerFactory from '../remove-cycle/remove-reducer';
import updateReducerFactory from '../update-cycle/update-reducer';

const defaultReducerFactories = {
  createReducerFactory,
  fetchReducerFactory,
  removeReducerFactory,
  updateReducerFactory,
};

export default defaultReducerFactories;
