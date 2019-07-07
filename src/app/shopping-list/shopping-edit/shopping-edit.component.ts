import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('nameInput', {static: false})
  nameInput: ElementRef<HTMLInputElement>;

  @ViewChild('amountInput', {static: false})
  amountInput: ElementRef<HTMLInputElement>;

  constructor(private shoppingListSvc: ShoppingListService) {
  }

  ngOnInit() {
  }

  submitNewIngredient() {
    this.shoppingListSvc.addIngredient(
      new Ingredient(this.nameInput.nativeElement.value,
        this.amountInput.nativeElement.value as unknown as number)
    );
  }

}
