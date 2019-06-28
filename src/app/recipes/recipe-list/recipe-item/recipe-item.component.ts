import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../recipe.model';
import {RecipeService} from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
})
export class RecipeItemComponent implements OnInit {

  @Input('recipeItem')
  recipe: Recipe;

  constructor(private recipeSvc: RecipeService) {
  }

  ngOnInit() {
  }

  onRecipeItemClick() {
    this.recipeSvc.selectedRecipe.emit(this.recipe);
  }

}
