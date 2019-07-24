import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Ingredient } from '../shared/ingredient.model';
import { AppState } from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.action';

@Injectable({ providedIn: 'root' })
export class ShoppingListResolverService
  implements Resolve<{ ingredients: Ingredient[] }> {
  constructor(private store: Store<AppState>, private actions: Actions) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<{ ingredients: Ingredient[] }>
    | Promise<{ ingredients: Ingredient[] }>
    | { ingredients: Ingredient[] } {
    return this.store.select('shoppingList').pipe(
      take(1),
      map(ingredientsState => {
        return { ingredients: ingredientsState.ingredients };
      }),
      switchMap(ingredients => {
        if (ingredients.ingredients.length === 0) {
          this.store.dispatch(ShoppingListActions.fetchIngredients());
          return this.actions.pipe(
            ofType(ShoppingListActions.setIngredients),
            take(1)
          );
        }
        return of(ingredients);
      })
    );
  }
}
