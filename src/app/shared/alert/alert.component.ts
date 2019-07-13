import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input()
  alertMessage: string;

  @Output()
  dismissed = new EventEmitter<void>();

  onDismiss() {
    this.dismissed.emit();
  }
}
