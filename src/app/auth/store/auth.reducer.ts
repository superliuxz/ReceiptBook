import { UserModel } from '../user.model';
import { AuthActions, LOGIN, LOGOUT } from './auth.actions';

export interface AuthState {
  user: UserModel;
}

const initialState = {
  user: null,
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: new UserModel(
          action.payload.email,
          action.payload.localId,
          action.payload.idToken,
          action.payload.tokenExpirationDate
        ),
      };
    case LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
}
