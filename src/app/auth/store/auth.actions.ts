import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
  '[Auth] LOGIN_START',
  props<{ email: string; password: string }>()
);
export const signupStart = createAction(
  '[Auth] SIGNUP_START',
  props<{ email: string; password: string }>()
);
export const authenticateSuccess = createAction(
  '[Auth] AUTHENTICATE_SUCCESS',
  props<{
    email: string;
    localId: string;
    idToken: string;
    tokenExpirationDate: Date;
    redirect: boolean;
  }>()
);
export const authenticateFail = createAction(
  '[Auth] AUTHENTICATE_FAIL',
  props<{ errorMessage: string }>()
);
export const dismissError = createAction('[Auth] DISMISS_ERROR');
export const autoLogin = createAction('[Auth] AUTO_LOGIN');
export const logout = createAction('[Auth] LOGOUT');
