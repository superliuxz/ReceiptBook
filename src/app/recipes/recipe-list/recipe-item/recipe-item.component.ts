import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Recipe} from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
})
export class RecipeItemComponent implements OnInit {

  @Input('recipeItem')
  recipe: Recipe;

  /*
  void because in recipe-list.component.html, there is an ngFor loop where we
  have access to each individual Recipe object.
   */
  @Output()
  recipeSelectedEmitter = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

  onRecipeItemClick() {
    this.recipeSelectedEmitter.emit();
  }

}
