import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { AddIngredients } from '../../shopping-list/store/shopping-list.action';

import { AppState } from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { DeleteRecipe } from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    let id: number;
    this.route.params
      .pipe(
        map(params => Number(params.recipeId)),
        switchMap(recipeId => {
          id = recipeId;
          return this.store.select('recipes');
        }),
        map(recipeState => {
          return recipeState.recipes.find((recipe, idx) => {
            return idx === id;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });

    if (!this.recipe) {
      const url = this.router.url;
      this.router.navigate(['/recipe']).then(navSuccess => {
        console.log('Invalid URL: ' + url);
      });
    }
  }

  onAddToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router
      .navigate(['edit'], { relativeTo: this.route })
      .then((navSuccess: boolean) => {
        if (!navSuccess) {
          console.log(
            'failed to navigate to /recipes/_id_/edit after editing!'
          );
        }
      });
  }

  onDeleteRecipe() {
    this.route.params.subscribe((params: Params) => {
      this.store.dispatch(new DeleteRecipe(Number(params.recipeId)));
    });
    this.router
      .navigate(['..'], { relativeTo: this.route })
      .then((navSuccess: boolean) => {
        if (!navSuccess) {
          console.log('failed to navigate to /recipes/ after deleting!');
        }
      });
  }
}
