import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  constructor(
    private recipeSvc: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.recipes = this.recipeSvc.getRecipes();
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
