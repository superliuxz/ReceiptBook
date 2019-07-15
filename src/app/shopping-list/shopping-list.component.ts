import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { StartEdit } from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    /* The type is an object that has a key shoppingList, and value returned
     * from ShoppingListReducer function in shopping-list.reducer.ts. */
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number): void {
    this.store.dispatch(new StartEdit(index));
  }
}
