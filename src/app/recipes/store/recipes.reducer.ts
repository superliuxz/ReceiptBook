import { Action, createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipes.actions';

export interface RecipesState {
  recipes: Recipe[];
}
const initialState: RecipesState = { recipes: [] };

export function recipesReducer(
  recipeState: RecipesState | undefined,
  recipeAction: Action
) {
  return createReducer(
    initialState,
    on(RecipesActions.addRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.concat({ ...action.recipe }),
    })),
    on(RecipesActions.updateRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.map((recipe, index) =>
        index === action.index ? { ...action.recipe } : recipe
      ),
    })),
    on(RecipesActions.deleteRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.filter((recipe, index) => index !== action.index),
    })),
    on(RecipesActions.setRecipes, (state, action) => ({
      ...state,
      recipes: [...action.recipes],
    }))
  )(recipeState, recipeAction);
}
