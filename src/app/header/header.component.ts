import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { logout } from '../auth/store/auth.actions';
import * as RecipesAction from '../recipes/store/recipes.actions';
import * as ShoppingListAction from '../shopping-list/store/shopping-list.action';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.userSub = this.store.select('auth').subscribe(authState => {
      this.isAuthenticated = !!authState.user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogOut() {
    this.store.dispatch(logout());
  }

  onSaveData() {
    this.store.dispatch(RecipesAction.storeRecipes());
    this.store.dispatch(ShoppingListAction.storeIngredients());
  }

  onFetchData() {
    this.store.dispatch(RecipesAction.fetchRecipes());
    this.store.dispatch(ShoppingListAction.fetchIngredients());
  }
}
