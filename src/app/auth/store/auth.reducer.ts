import { Action, createReducer, on } from '@ngrx/store';

import { UserModel } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: UserModel;
  authError: string;
  loading: boolean;
}

const initialState: AuthState = { user: null, authError: null, loading: false };

export function authReducer(
  authState: AuthState | undefined,
  authAction: Action
) {
  return createReducer(
    initialState,
    on(AuthActions.loginStart, AuthActions.signupStart, state => ({
      ...state,
      authError: null,
      loading: true,
    })),
    on(AuthActions.authenticateSuccess, (state, action) => ({
      ...state,
      authError: null,
      loading: true,
      user: new UserModel(
        action.email,
        action.localId,
        action.idToken,
        action.tokenExpirationDate
      ),
    })),
    on(AuthActions.authenticateSuccessStopLoading, state => ({
      ...state,
      loading: false,
    })),
    on(AuthActions.authenticateFail, (state, action) => ({
      ...state,
      user: null,
      authError: action.errorMessage,
      loading: false,
    })),
    on(AuthActions.logout, state => ({ ...state, user: null, loading: false })),
    on(AuthActions.dismissError, state => ({ ...state, authError: null }))
  )(authState, authAction);
}
