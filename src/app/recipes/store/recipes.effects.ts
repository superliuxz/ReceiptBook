import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AppConstants } from '../../app-constants';
import { AppState } from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { FETCH_RECIPE, SetRecipe, STORE_RECIPES } from './recipes.actions';

@Injectable()
export class RecipesEffects {
  @Effect()
  fetchRecipes = this.actions.pipe(
    ofType(FETCH_RECIPE),
    switchMap(() => {
      return this.http.get<Recipe[]>(AppConstants.firebaseUrl);
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
      return new SetRecipe(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions.pipe(
    ofType(STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(
      ([
        storeRecipesAction,
        recipesState /* this arg comes from withLatestFrom */,
      ]) => {
        return this.http.put(AppConstants.firebaseUrl, recipesState.recipes);
      }
    )
  );

  constructor(
    private actions: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
