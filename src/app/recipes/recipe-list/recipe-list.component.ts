import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '../../store/app.reducer';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.recipesSub = this.store.select('recipes').subscribe(recipesState => {
      this.recipes = recipesState.recipes;
    });
  }

  ngOnDestroy(): void {
    this.recipesSub.unsubscribe();
  }

  onNewRecipe() {
    this.router
      .navigate(['new'], { relativeTo: this.route })
      .then((navSuccess: boolean) => {
        if (!navSuccess) {
          console.log('failed to navigate to /recipes/new');
        }
      });
  }
}
