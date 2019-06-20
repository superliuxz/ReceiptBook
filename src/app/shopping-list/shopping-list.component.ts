import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Chicken', 5),
    new Ingredient('Garlic', 2)
  ];

  constructor() {
  }

  ngOnInit() {
  }

  addNewIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

}
