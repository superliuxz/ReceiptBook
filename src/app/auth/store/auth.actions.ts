import { Action } from '@ngrx/store';

export type AuthActions = Login | Logout;

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(
    public payload: {
      email: string;
      localId: string;
      idToken: string;
      tokenExpirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}
