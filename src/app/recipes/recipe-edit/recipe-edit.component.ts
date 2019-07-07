import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styles: [
    `
      input.ng-invalid,
      textarea.ng-invalid {
        border: 1px solid red;
      }
    `,
  ],
})
export class RecipeEditComponent implements OnInit {
  recipeIndex: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeSvc: RecipeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.recipeIndex = params.recipeId;
      // |recipe-edit| component can either be loaded at |/recipes/new| or
      // |/recipes/<id>/edit|.
      this.editMode = params.hasOwnProperty('recipeId');
      this.initForm();
    });
  }

  private initForm(): void {
    let name = '';
    let imageUrl = '';
    let description = '';
    const recipeIngredients = new FormArray([]);

    // We are editing existing recipe.
    if (this.editMode) {
      const recipe = this.recipeSvc.getRecipe(this.recipeIndex);
      name = recipe.name;
      imageUrl = recipe.imageUrl;
      description = recipe.description;
      if (recipe.ingredients) {
        recipe.ingredients.forEach((ingredient: Ingredient) => {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, [Validators.required]),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        });
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      imageUrl: new FormControl(imageUrl, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
      ingredients: recipeIngredients,
    });
  }

  onAddIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onSubmit(): void {
    console.log(this.recipeForm);
  }
}
