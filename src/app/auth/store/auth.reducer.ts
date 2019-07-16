import { UserModel } from '../user.model';
import {
  AuthActions,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAIL,
  LOGIN_START,
  LOGOUT,
  SIGNUP_START,
  DISMISS_ERROR,
} from './auth.actions';

export interface AuthState {
  user: UserModel;
  authError: string;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      return {
        ...state,
        user: new UserModel(
          action.payload.email,
          action.payload.localId,
          action.payload.idToken,
          action.payload.tokenExpirationDate
        ),
        authError: null,
        loading: false,
      };
    case LOGOUT:
      return { ...state, user: null, authError: null };
    case LOGIN_START:
    case SIGNUP_START:
      return { ...state, authError: null, loading: true };
    case AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      };
    case DISMISS_ERROR:
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
}
