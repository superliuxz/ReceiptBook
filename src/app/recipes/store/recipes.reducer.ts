import { Recipe } from '../recipe.model';
import {
  ADD_RECIPE,
  DELETE_RECIPE,
  RecipesActions,
  SET_RECIPE,
  UPDATE_RECIPE,
} from './recipes.actions';

export interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [],
};

export function recipesReducer(
  state = initialState,
  action: RecipesActions
): RecipesState {
  switch (action.type) {
    case SET_RECIPE:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    case UPDATE_RECIPE:
      const updatedRecipes = [...state.recipes];
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe,
      };
      updatedRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes,
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, idx) => {
          return idx !== action.payload;
        }),
      };
    default:
      return state;
  }
}
