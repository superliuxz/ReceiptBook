import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { AppState } from '../../store/app.reducer';
import {
  AddIngredient,
  DeleteIngredient,
  StopEdit,
  UpdateIngredient,
} from '../store/shopping-list.action';
import { ShoppingListState } from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editItem: Ingredient;

  @ViewChild('f', { static: false })
  shoppingListForm: NgForm;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((stateData: ShoppingListState) => {
        if (stateData.editedIngredientIdx > -1) {
          this.editMode = true;
          this.editItem = stateData.editedIngredient;
          this.shoppingListForm.setValue({
            name: this.editItem.name,
            amount: this.editItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  editOrAddIngredient() {
    const newIngredient = new Ingredient(
      this.shoppingListForm.value.name,
      this.shoppingListForm.value.amount
    );
    if (this.editMode) {
      this.store.dispatch(new UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new AddIngredient(newIngredient));
    }
    this.onClear();
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient());
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(new StopEdit());
  }
}
