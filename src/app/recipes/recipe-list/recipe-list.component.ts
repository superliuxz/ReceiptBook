import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  constructor(private recipeSvc: RecipeService) {
  }

  ngOnInit() {
    this.recipes = this.recipeSvc.getRecipes();
  }

}
