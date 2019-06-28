import {Ingredient} from '../shared/ingredient.model';
import {EventEmitter, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<void>();

  private ingredients = [
    new Ingredient('Chicken', 5),
    new Ingredient('Garlic', 2)
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(newIngredient: Ingredient): void {
    this.ingredients.push(newIngredient);
    // Also inform the subscribers that the private list has been updated.
    this.ingredientsChanged.emit();
  }

  addIngredients(newIngredients: Ingredient[]): void {
    this.ingredients.push(...newIngredients); // ES6, unpack array to a stream
    // of objects.
    this.ingredientsChanged.emit();
  }
}
