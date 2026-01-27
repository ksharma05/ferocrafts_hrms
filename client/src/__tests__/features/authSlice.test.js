import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  reset,
} from '../../features/auth/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  };

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle reset action', () => {
    const previousState = {
      user: { email: 'test@example.com' },
      isError: true,
      isSuccess: true,
      isLoading: true,
      message: 'Some message',
    };

    expect(authReducer(previousState, reset())).toEqual(initialState);
  });

  describe('Login', () => {
    it('should set loading state on login pending', () => {
      const action = { type: 'auth/login/pending' };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('should set user and success on login fulfilled', () => {
      const user = { email: 'test@example.com', role: 'employee' };
      const action = {
        type: 'auth/login/fulfilled',
        payload: user,
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.user).toEqual(user);
    });

    it('should set error on login rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: 'auth/login/rejected',
        payload: errorMessage,
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should clear user on logout fulfilled', () => {
      const previousState = {
        ...initialState,
        user: { email: 'test@example.com' },
      };

      const action = { type: 'auth/logout/fulfilled' };
      const state = authReducer(previousState, action);

      expect(state.user).toBeNull();
    });
  });
});

