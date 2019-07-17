import { Action } from '@ngrx/store';

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | DismissError
  | AutoLogin;

// Actions.
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const DISMISS_ERROR = 'DISMISS_ERROR';
export const LOGIN_START = 'LOGIN_START';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const SIGNUP_START = 'SIGNUP_START';
export const AUTO_LOGIN = 'AUTO_LOGIN';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      email: string;
      localId: string;
      idToken: string;
      tokenExpirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(
    public payload: {
      email: string;
      password: string;
    }
  ) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(
    public payload: {
      email: string;
      password: string;
    }
  ) {}
}

export class DismissError implements Action {
  readonly type = DISMISS_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}
