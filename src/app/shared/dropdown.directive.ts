import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open')
  isOpen = false;

  constructor(private elRef: ElementRef) {
  }

  /*
  Set |isOpen| to true by clicking the dropdown menu; set to false by clicking
  anywhere again. See https://stackoverflow.com/questions/40107008/detect-click-outside-angular-component
   */
  @HostListener('document:click', ['$event'])
  toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ?
      !this.isOpen : false;
  }
}
