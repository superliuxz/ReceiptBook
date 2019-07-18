import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

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
  private storeSub: Subscription;

  constructor(
    private compFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
    this.storeSub.unsubscribe();
    this.authForm.reset();
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
    const payload = {
      email: this.authForm.value.email,
      password: this.authForm.value.password,
    };
    if (this.loginMode) {
      this.store.dispatch(AuthActions.loginStart(payload));
    } else {
      this.store.dispatch(AuthActions.signupStart(payload));
    }
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
        this.store.dispatch(AuthActions.dismissError());
        this.alertHost.viewContainerRef.clear();
        this.dismissSubscription.unsubscribe();
      }
    );
  }
}
