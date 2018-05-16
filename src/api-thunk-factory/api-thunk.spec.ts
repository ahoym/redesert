import apiThunk from './api-thunk';
import { resourceApiActionTypesFactory } from '../actions';

describe('apiThunk()', () => {
  const mockResponse = {
    id: '123',
    name: 'foo',
  };
  const dispatchFn = jest.fn();
  const fooApiActions = resourceApiActionTypesFactory('foo');
  const baseActionType = fooApiActions.FETCH;
  const networkRequest = jest
    .fn()
    .mockReturnValue(Promise.resolve(mockResponse));
  const defaultProps = {
    baseActionType,
    networkRequest,
  };

  const createApiThunkAndInvoke = (thunkProps: object = {}) => {
    const actionCreator = apiThunk({ ...defaultProps, ...thunkProps });
    return actionCreator(dispatchFn);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('successful networkRequest responses', () => {
    it('dispatches the *__START and *__SUCCESS actions', async () => {
      await createApiThunkAndInvoke();
      expect(dispatchFn.mock.calls).toMatchSnapshot();
    });

    it('dispatches the actions with meta attributes', async () => {
      const meta = { referenceId: '123' };
      await createApiThunkAndInvoke({ meta });
      expect(dispatchFn.mock.calls).toMatchSnapshot();
    });

    it('uses the successNormalizer to parse the response for the action.payload', async () => {
      const successNormalizer = (mockResp: object) => ({
        ...mockResponse,
        added: 'from success normalizer',
      });
      const normalizedResp = await createApiThunkAndInvoke({
        successNormalizer,
      });

      expect(normalizedResp).toEqual({
        ...mockResponse,
        added: 'from success normalizer',
      });
    });

    it('returns a Promise-y value that also can be chained off of', () => {
      return createApiThunkAndInvoke().then((resp: any) => {
        expect(resp).toEqual(mockResponse);
      });
    });
  });

  describe('failed networkRequest responses', () => {
    const mockFailureResponse = {
      status: 500,
      statusText: 'Internal server error',
    };

    beforeAll(() => {
      networkRequest.mockRejectedValue(mockFailureResponse);
    });

    it('dispatches the *__START and *__ERROR actions', async () => {
      try {
        await createApiThunkAndInvoke();
      } catch (error) {
        expect(dispatchFn.mock.calls).toMatchSnapshot();
      }
    });

    it('dispatches the actions with meta attributes', async () => {
      try {
        const meta = { referenceId: '123' };
        await createApiThunkAndInvoke({ meta });
      } catch (error) {
        expect(dispatchFn.mock.calls).toMatchSnapshot();
      }
    });

    it('uses the failureNormalizer to parse the response for the action.errors', async () => {
      try {
        const failureNormalizer = (mockResp: any) => [mockResp.statusText];
        await createApiThunkAndInvoke({ failureNormalizer });
      } catch (error) {
        expect(dispatchFn).toHaveBeenLastCalledWith(
          expect.objectContaining({
            errors: [mockFailureResponse.statusText],
          })
        );
      }
    });

    it('returns a Promise-y value that also can be chained off of', () => {
      return createApiThunkAndInvoke().catch((error: any) => {
        expect(error).toEqual(mockFailureResponse);
      });
    });
  });
});
