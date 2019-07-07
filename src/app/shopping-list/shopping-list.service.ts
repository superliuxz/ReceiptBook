import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<void>();
  startedEditing = new Subject<number>();

  private ingredients = [
    new Ingredient('Chicken', 5),
    new Ingredient('Garlic', 2),
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  addIngredient(newIngredient: Ingredient): void {
    this.ingredients.push(newIngredient);
    // Also inform the subscribers that the private list has been updated.
    this.ingredientsChanged.next();
  }

  addIngredients(newIngredients: Ingredient[]): void {
    this.ingredients.push(...newIngredients); // ES6, unpack array to a stream
    // of objects.
    this.ingredientsChanged.next();
  }

  updateIngredient(index: number, newIngredient: Ingredient): void {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next();
  }

  deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next();
  }
}
