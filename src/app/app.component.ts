import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {
    this.authSvc.autoLogin();
  }
}
