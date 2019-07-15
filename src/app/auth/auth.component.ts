import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AuthResponsePayload, AuthService } from './auth.service';

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
export class AuthComponent implements OnInit, OnDestroy {
  loginMode = true;
  loading = false;
  error: string;
  authForm: FormGroup;

  // Go into the template html, and find the first occurrence of
  // PlaceholderDirective in the DOM.
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private dismissSubscription: Subscription;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private compFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnDestroy(): void {
    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
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
    authObservable.subscribe(
      respData => {
        this.loading = false;
        this.router.navigate(['/recipes']);
      },
      errorMsg => {
        this.error = errorMsg;
        this.loading = false;
        this.showErrorAlert(errorMsg);
      }
    );
    this.authForm.reset();
  }

  private showErrorAlert(errorMsg: string) {
    const alertCompFactory = this.compFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    this.alertHost.viewContainerRef.clear();
    const alertComponent = this.alertHost.viewContainerRef.createComponent(
      alertCompFactory
    );
    alertComponent.instance.alertMessage = errorMsg;
    this.dismissSubscription = alertComponent.instance.dismissed.subscribe(
      () => {
        this.error = null;
        this.alertHost.viewContainerRef.clear();
        this.dismissSubscription.unsubscribe();
      }
    );
  }
}
