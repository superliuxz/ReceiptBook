import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenExpirationTimer: any;

  constructor(private store: Store<AppState>) {}

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  }
}
