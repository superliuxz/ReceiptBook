import { createAction, props } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const addRecipe = createAction(
  '[Recipes] ADD_RECIPE',
  props<{ recipe: Recipe }>()
);
export const updateRecipe = createAction(
  '[Recipes] UPDATE_RECIPE',
  props<{ index: number; recipe: Recipe }>()
);
export const deleteRecipe = createAction(
  '[Recipes] DELETE_RECIPE',
  props<{ index: number }>()
);
export const setRecipes = createAction(
  '[Recipes] SET_RECIPES',
  props<{ recipes: Recipe[] }>()
);
export const fetchRecipes = createAction('[Recipes] FETCH_RECIPES');
export const storeRecipes = createAction('[Recipes] STORE_RECIPES');
