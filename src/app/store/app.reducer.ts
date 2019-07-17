import { ActionReducerMap } from '@ngrx/store';

import { authReducer, AuthState } from '../auth/store/auth.reducer';
import { recipesReducer, RecipesState } from '../recipes/store/recipes.reducer';
import {
  ShoppingListReducer,
  ShoppingListState,
} from '../shopping-list/store/shopping-list.reducer';

export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipes: RecipesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: ShoppingListReducer,
  auth: authReducer,
  recipes: recipesReducer,
};
