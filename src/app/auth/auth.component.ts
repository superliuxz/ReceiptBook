import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponsePayload, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: [
    `
      input.ng-invalid.ng-touched.ng-dirty,
      textarea.ng-invalid.ng-touched.ng-dirty {
        border: 1px solid red;
      }
    `,
  ],
})
export class AuthComponent implements OnInit {
  loginMode = true;
  loading = false;
  error: string;
  authForm: FormGroup;

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  isValid(controlName: string): boolean {
    return (
      this.authForm.get(controlName).invalid &&
      (this.authForm.get(controlName).dirty ||
        this.authForm.get(controlName).touched)
    );
  }

  onSwitchMode() {
    this.authForm.reset();
    this.loginMode = !this.loginMode;
    this.error = null;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    let authObservable: Observable<AuthResponsePayload>;
    this.loading = true;
    if (this.loginMode) {
      authObservable = this.authSvc.login(
        this.authForm.value.email,
        this.authForm.value.password
      );
    } else {
      authObservable = this.authSvc.signUp(
        this.authForm.value.email,
        this.authForm.value.password
      );
    }
    const sub = authObservable.subscribe(
      respData => {
        this.loading = false;
        this.router.navigate(['/recipes']);
        sub.unsubscribe();
      },
      errorMsg => {
        this.error = errorMsg;
        this.loading = false;
        sub.unsubscribe();
      }
    );
    this.authForm.reset();
  }
}
