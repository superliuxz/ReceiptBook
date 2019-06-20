import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Test Recipe', 'A test recipe',
      'https://assets3.thrillist.com/v1/image/2797371/size/' +
      'tl-horizontal_main_2x.jpg'),
    new Recipe('Test Recipe 2', 'A test recipe 2',
      'https://assets3.thrillist.com/v1/image/2797371/size/' +
      'tl-horizontal_main_2x.jpg')
  ];

  @Output()
  selectedRecipeEmitter = new EventEmitter<Recipe>();

  constructor() {
  }

  ngOnInit() {
  }

  propagateSelectedRecipe(selected: Recipe): void {
    this.selectedRecipeEmitter.emit(selected);
  }

}
