import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<void>();

  private ingredients = [
    new Ingredient('Chicken', 5),
    new Ingredient('Garlic', 2),
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
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
}
