import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Logout } from '../auth/store/auth.actions';
import { FetchRecipe, StoreRecipes } from '../recipes/store/recipes.actions';
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
    this.store.dispatch(new Logout());
  }

  onSaveData() {
    this.store.dispatch(new StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new FetchRecipe());
  }
}
