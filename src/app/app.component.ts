import { isPlatformBrowser, Location } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import * as cookie from 'cookie';

import * as AuthActions from './auth/store/auth.actions';
import { UserModel } from './auth/user.model';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private location: Location,
    // Inject a platform id.
    @Inject(PLATFORM_ID) private platformId,
    // Express Request object, but Express is for Node.
    @Optional() @Inject(REQUEST) private request: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(AuthActions.autoLogin());
      return;
    }
    if (!this.request.header('cookie')) {
      this.store.dispatch(AuthActions.logout());
      return;
    }
    const cookieValue = cookie.parse(this.request.header('cookie')).user;
    if (!cookieValue) {
      this.store.dispatch(AuthActions.logout());
      return;
    }
    const user = JSON.parse(cookieValue);
    const loadedUser = new UserModel(
      user.email,
      user.localId,
      user.idToken,
      new Date(user.tokenExpirationDate)
    );
    if (!loadedUser.token) {
      this.store.dispatch(AuthActions.logout());
      return;
    }
    // Notice CANNOT call this.authSvc.setLogoutTimer here because Universal
    // will wait for all async operations ( including timeouts) to complete
    // before rendering. The server will hang (for an hour) if called.
    this.store.dispatch(
      AuthActions.authenticateSuccess({
        email: user.email,
        localId: user.localId,
        idToken: user.idToken,
        tokenExpirationDate: new Date(user.tokenExpirationDate),
        redirect: this.location.path() === '/auth',
      })
    );
  }
}
