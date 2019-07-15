import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';
import { AppConstants } from '../../app-constants';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styles: [
    `
      input.ng-invalid.ng-touched,
      textarea.ng-invalid.ng-touched {
        border: 1px solid red;
      }
    `,
  ],
})
export class RecipeEditComponent implements OnInit {
  recipeIndex: number;
  editMode: boolean;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeSvc: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let recipe: Recipe;
      if (params.hasOwnProperty('recipeId')) {
        this.recipeIndex = Number(params.recipeId);
        recipe = this.recipeSvc.getRecipe(this.recipeIndex);
        this.editMode = true;
      } else {
        this.editMode = false;
      }
      // Independent of the validity of url, we need to initForm.
      // because in the html, we have the binding [formGroup]="recipeForm",
      // where recipeForm MUST be initialized.
      this.initForm();

      if (!recipe) {
        const url = this.router.url;
        this.router.navigate(['/recipes']).then(navSuccess => {
          console.log('Invalid URL: ' + url);
        });
      }
    });
  }

  private initForm(): void {
    let name = '';
    let imageUrl = '';
    let description = '';
    const recipeIngredients = new FormArray([]);

    const recipe = this.recipeSvc.getRecipe(this.recipeIndex);
    // We are editing existing recipe.
    if (this.editMode && recipe) {
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
                Validators.pattern(AppConstants.amountValidator),
              ]),
            })
          );
        });
      }
    }
    // Init the form.
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
          Validators.pattern(AppConstants.amountValidator),
        ]),
      })
    );
  }

  onSubmit(): void {
    // recipeForm.value will have the same format as the Recipe object, hence
    // we can pass this.recipeForm.value, instead of init a new object like the
    // following.
    // const newRecipe = new Recipe(
    //   this.recipeForm.value.name,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.imageUrl,
    //   this.recipeForm.value.ingredients
    // );
    if (this.editMode) {
      this.recipeSvc.updateRecipe(this.recipeIndex, this.recipeForm.value);
    } else {
      this.recipeSvc.addRecipe(this.recipeForm.value);
    }
    this.navAway();
  }

  onDiscard(): void {
    this.navAway();
  }

  private navAway(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  get ingredientsControls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
}
