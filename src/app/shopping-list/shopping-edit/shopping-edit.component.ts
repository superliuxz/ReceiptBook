import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  startedEditingSubscription: Subscription;
  editMode = false;
  editIndex: number;
  editItem: Ingredient;

  @ViewChild('f', { static: false })
  shoppingListForm: NgForm;

  constructor(private shoppingListSvc: ShoppingListService) {}

  ngOnInit() {
    this.startedEditingSubscription = this.shoppingListSvc.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editIndex = index;
        this.editItem = this.shoppingListSvc.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.startedEditingSubscription.unsubscribe();
  }

  editOrAddIngredient() {
    const newIngredient = new Ingredient(
      this.shoppingListForm.value.name,
      this.shoppingListForm.value.amount
    );
    if (this.editMode) {
      this.shoppingListSvc.updateIngredient(this.editIndex, newIngredient);
    } else {
      this.shoppingListSvc.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onDelete() {
    this.shoppingListSvc.deleteIngredient(this.editIndex);
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingListForm.reset();
  }
}
