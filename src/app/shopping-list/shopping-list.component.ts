import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingredientsChangedSubscription: Subscription;

  constructor(private shoppingListSvc: ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListSvc.getIngredients();
    this.ingredientsChangedSubscription = this.shoppingListSvc.ingredientsChanged.subscribe(
      () => {
        this.ingredients = this.shoppingListSvc.getIngredients();
      }
    );
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubscription.unsubscribe();
  }
}
