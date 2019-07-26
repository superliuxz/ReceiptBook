import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fadeInFadeOut } from '../shared/animation';

import { Ingredient } from '../shared/ingredient.model';
import { AppState } from '../store/app.reducer';
import * as ShoppingListAction from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  animations: [fadeInFadeOut()],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    /* The type is an object that has a key shoppingList, and value returned
     * from ShoppingListReducer function in shopping-list.reducer.ts. */
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number): void {
    this.store.dispatch(ShoppingListAction.startEdit({ index }));
  }
}
