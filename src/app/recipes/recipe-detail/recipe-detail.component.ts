import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(
    private recipeSvc: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = Number(params.recipeId);
      this.recipe = this.recipeSvc.getRecipe(id);
      if (!this.recipe) {
        const url = this.router.url;
        this.router.navigate(['/recipe']).then(navSuccess => {
          console.log('Invalid URL: ' + url);
        });
      }
    });
  }

  onAddToShoppingList() {
    this.recipeSvc.addIngredientsToShoppingList(this.recipe.ingredients);
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
      this.recipeSvc.deleteRecipe(Number(params.recipeId));
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
