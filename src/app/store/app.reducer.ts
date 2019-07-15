import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store/auth.reducer';
import {
  ShoppingListReducer,
  ShoppingListState,
} from '../shopping-list/store/shopping-list.reducer';

export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: ShoppingListReducer,
  auth: authReducer,
};
