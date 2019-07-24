import { Action, createReducer, on } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.action';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [],
  editIndex: -1,
};

export function shoppingListReducer(
  shoppingListState: ShoppingListState | undefined,
  shoppingListAction: Action
) {
  return createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, action) => ({
      ...state,
      ingredients: state.ingredients.concat(action.ingredient),
    })),
    on(ShoppingListActions.addIngredients, (state, action) => ({
      ...state,
      ingredients: state.ingredients.concat(...action.ingredients),
    })),
    on(ShoppingListActions.updateIngredient, (state, action) => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.map((ingredient, index) =>
        index === state.editIndex ? { ...action.ingredient } : ingredient
      ),
    })),
    on(ShoppingListActions.deleteIngredient, state => ({
      ...state,
      editIndex: -1,
      ingredients: state.ingredients.filter(
        (ingredient, index) => index !== state.editIndex
      ),
    })),
    on(ShoppingListActions.startEdit, (state, action) => ({
      ...state,
      editIndex: action.index,
    })),
    on(ShoppingListActions.stopEdit, state => ({ ...state, editIndex: -1 })),
    on(ShoppingListActions.setIngredients, (state, action) => ({
      ...state,
      ingredients: action.ingredients,
    }))
  )(shoppingListState, shoppingListAction);
}
