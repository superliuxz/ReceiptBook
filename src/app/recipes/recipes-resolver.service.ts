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

import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';
import * as RecipesAction from './store/recipes.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<{ recipes: Recipe[] }> {
  constructor(private store: Store<AppState>, private actions: Actions) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<{ recipes: Recipe[] }>
    | Promise<{ recipes: Recipe[] }>
    | { recipes: Recipe[] } {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return { recipes: recipesState.recipes };
      }),
      switchMap(recipes => {
        if (recipes.recipes.length === 0) {
          this.store.dispatch(RecipesAction.fetchRecipes());
          return this.actions.pipe(
            ofType(RecipesAction.setRecipes),
            take(1)
          );
        }
        return of(recipes);
      })
    );
  }
}
