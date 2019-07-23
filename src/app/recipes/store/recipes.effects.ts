import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppConstants } from '../../app-constants';
import { AppState } from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import * as RecipesAction from './recipes.actions';

@Injectable()
export class RecipesEffects {
  fetchRecipes = createEffect(() => {
    return this.actions.pipe(
      ofType(RecipesAction.fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>('http://localhost:12345/get-recipes', {withCredentials: true});
      }),
      map(recipes => {
        if (!recipes) {
          return [];
        }
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map(recipes => {
        return RecipesAction.setRecipes({ recipes });
      })
    );
  });

  storeRecipes = createEffect(
    () => {
      return this.actions.pipe(
        ofType(RecipesAction.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(
          ([
            storeRecipesAction,
            recipesState /* this arg comes from withLatestFrom */,
          ]) => {
            return this.http.post(
              'http://localhost:12345/recipe',
              recipesState.recipes, {withCredentials: true}
            );
          }
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
