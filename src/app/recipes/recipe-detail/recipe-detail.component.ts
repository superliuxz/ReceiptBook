import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
})
export class RecipeDetailComponent implements OnInit {

  @Input()
  recipe: Recipe;

  constructor(private recipeSvc: RecipeService) {
  }

  ngOnInit() {
  }

  onAddToShoppingList() {
    this.recipeSvc.addIngredsToSL(this.recipe.ingredients);
  }

}
