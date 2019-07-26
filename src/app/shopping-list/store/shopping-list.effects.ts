import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Ingredient } from '../../shared/ingredient.model';
import { AppState } from '../../store/app.reducer';
import * as ShoppingListActions from './shopping-list.action';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}

  fetchShoppingList = createEffect(() => {
    return this.actions.pipe(
      ofType(ShoppingListActions.fetchIngredients),
      switchMap(() => {
        return this.http.get<Ingredient[]>(environment.ingredientsUrl);
      }),
      map(ingredients => {
        return ShoppingListActions.setIngredients({ ingredients });
      })
    );
  });

  storeShoppingList = createEffect(
    () => {
      return this.actions.pipe(
        ofType(ShoppingListActions.storeIngredients),
        withLatestFrom(this.store.select('shoppingList')),
        switchMap(([storeIngredientsAction, shoppingListState]) => {
          return this.http.put<Ingredient[]>(
            environment.ingredientsUrl,
            shoppingListState.ingredients
          );
        })
      );
    },
    { dispatch: false }
  );
}
