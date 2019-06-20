import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Output()
  displayPageEmitter = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  recipesClicked(): void {
    this.displayPageEmitter.emit('recipes');
  }

  shoppingListClicked(): void {
    this.displayPageEmitter.emit('shopping');
  }

}
