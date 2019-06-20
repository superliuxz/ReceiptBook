import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('nameInput', {static: false})
  nameInput: ElementRef<string>;

  @ViewChild('amountInput', {static: false})
  amountInput: ElementRef<number>;

  @Output()
  newIngredientEmitter = new EventEmitter<Ingredient>();

  constructor() {
  }

  ngOnInit() {
  }

  submitNewIngredient() {
    this.newIngredientEmitter.emit(
      new Ingredient(this.nameInput.nativeElement.value,
        this.amountInput.nativeElement.value)
    );
  }

}
