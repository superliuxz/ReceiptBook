import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { AddIngredients } from '../shopping-list/store/shopping-list.action';
import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Test Recipe',
  //     'A test recipe',
  //     'https://assets3.thrillist.com/v1/image/2797371/size/' +
  //       'tl-horizontal_main_2x.jpg',
  //     [new Ingredient('meat', 1), new Ingredient('cooking wine', 1)]
  //   ),
  //   new Recipe(
  //     'Test Recipe 2',
  //     'A test recipe 2',
  //     'https://assets3.thrillist.com/v1/image/2797371/size/' +
  //       'tl-horizontal_main_2x.jpg',
  //     [new Ingredient('something', 4), new Ingredient('another thing', 10)]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  constructor(private store: Store<AppState>) {}

  getRecipe(recipeId: number): Recipe {
    return this.recipes[recipeId];
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.getRecipes());
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.getRecipes());
  }
}
