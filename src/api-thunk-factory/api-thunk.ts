import { API_LIFECYCLE_SUFFIXES } from '../actions';

const { START, FAILURE, SUCCESS } = API_LIFECYCLE_SUFFIXES;

const noNormalization = (data: any) => data;

export type apiThunkConfig = {
  baseActionType: string;
  failureNormalizer?: Function;
  meta?: object;
  networkRequest: Function;
  successNormalizer?: Function;
};

function apiThunk({
  baseActionType,
  failureNormalizer = noNormalization,
  meta,
  networkRequest,
  successNormalizer = noNormalization,
}: apiThunkConfig): Function {
  return async (dispatch: Function) => {
    dispatch({
      type: `${baseActionType}_${START}`,
      meta,
    });

    try {
      const response = await networkRequest();
      const normalizedResponse = successNormalizer(response);

      dispatch({
        type: `${baseActionType}_${SUCCESS}`,
        payload: normalizedResponse,
        meta,
      });

      return normalizedResponse;
    } catch (error) {
      const normalizedErrors = failureNormalizer(error);

      dispatch({
        type: `${baseActionType}_${FAILURE}`,
        errors: normalizedErrors,
        meta,
      });

      throw error;
    }
  };
}

export default apiThunk;
