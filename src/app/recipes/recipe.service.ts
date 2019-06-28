import {Recipe} from './recipe.model';
import {EventEmitter, Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('Test Recipe', 'A test recipe',
      'https://assets3.thrillist.com/v1/image/2797371/size/' +
      'tl-horizontal_main_2x.jpg',
      [new Ingredient('meat', 1),
        new Ingredient('cooking wine', 1)]),
    new Recipe('Test Recipe 2', 'A test recipe 2',
      'https://assets3.thrillist.com/v1/image/2797371/size/' +
      'tl-horizontal_main_2x.jpg',
      [new Ingredient('something', 4),
        new Ingredient('another thing', 10)])
  ];

  selectedRecipe = new EventEmitter<Recipe>();

  constructor(private shoppingListSvc: ShoppingListService) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addIngredsToSL(ingredients: Ingredient[]) {
    this.shoppingListSvc.addIngredients(ingredients);
  }
}
