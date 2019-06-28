import {Recipe} from './recipe.model';
import {EventEmitter} from '@angular/core';

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('Test Recipe', 'A test recipe',
      'https://assets3.thrillist.com/v1/image/2797371/size/' +
      'tl-horizontal_main_2x.jpg'),
    new Recipe('Test Recipe 2', 'A test recipe 2',
      'https://assets3.thrillist.com/v1/image/2797371/size/' +
      'tl-horizontal_main_2x.jpg')
  ];

  selectedRecipe = new EventEmitter<Recipe>();

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }
}
