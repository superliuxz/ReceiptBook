import { Ingredient } from '../../shared/ingredient.model';
import {
  ADD_INGREDIENT,
  ADD_INGREDIENTS,
  DELETE_INGREDIENT,
  ShoppingListActions,
  START_EDIT,
  STOP_EDIT,
  UPDATE_INGREDIENT,
} from './shopping-list.action';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIdx: number;
}

const initialState: ShoppingListState = {
  editedIngredient: null,
  editedIngredientIdx: -1,
  ingredients: [new Ingredient('Chicken', 5), new Ingredient('Garlic', 2)],
};

export function ShoppingListReducer(
  state = initialState,
  action: ShoppingListActions
): ShoppingListState {
  switch (action.type) {
    case ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };
    case ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case UPDATE_INGREDIENT:
      const updated = {
        ...state.ingredients[state.editedIngredientIdx] /* not necessary */,
        ...action.payload,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIdx] = updated;
      // For update and delete, when the action is fired, we also want to stop
      // editing, hence reset editedIngredientIdx and editedIngredient.
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIdx: -1,
        editedIngredient: null,
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, index) => {
          return index !== state.editedIngredientIdx;
        }),
        editedIngredientIdx: -1,
        editedIngredient: null,
      };
    case START_EDIT:
      return {
        ...state,
        editedIngredientIdx: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };
    case STOP_EDIT:
      return {
        ...state,
        editedIngredientIdx: -1,
        editedIngredient: null,
      };
    default:
      return state;
  }
}
