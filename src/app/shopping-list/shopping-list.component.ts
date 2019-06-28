import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];

  constructor(private shoppingListSvc: ShoppingListService) {
  }

  ngOnInit() {
    this.ingredients = this.shoppingListSvc.getIngredients();
    this.shoppingListSvc.ingredientsChanged.subscribe(
      () => {
        this.ingredients = this.shoppingListSvc.getIngredients();
      }
    );
  }
}
