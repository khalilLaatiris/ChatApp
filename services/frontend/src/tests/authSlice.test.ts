import authReducer, { reset, AuthState } from '../app/authSlice';

describe('authSlice reducer', () => {
  const initialState: AuthState = {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle reset', () => {
    const previousState: AuthState = {
      user: { token: 'testToken', username: 'testUser' },
      isLoading: true,
      isSuccess: true,
      isError: true,
      message: 'test message',
    };

    const expectedState: AuthState = {
      user: { token: 'testToken', username: 'testUser' },
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
    };
    expect(authReducer(previousState, reset())).toEqual({
      ...previousState,
      isLoading: false,
      isSuccess: false,
      isError: false,
      message: '',
    });
  });
});