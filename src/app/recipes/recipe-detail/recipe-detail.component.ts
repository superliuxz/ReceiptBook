import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;

  constructor(private recipeSvc: RecipeService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.recipe = this.recipeSvc.getRecipe(Number(params.recipeId));
      }
    );
  }

  onAddToShoppingList() {
    this.recipeSvc.addIngredsToSL(this.recipe.ingredients);
  }

}
