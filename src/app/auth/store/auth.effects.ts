import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AppConstants } from '../../app-constants';
import { RecipesResolverService } from '../../recipes/recipes-resolver.service';
import { UserModel } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponsePayload {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private recipesResolver: RecipesResolverService,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private cookieSvc: CookieService
  ) {}

  authSignup = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.signupStart),
      switchMap(action => {
        return this.http
          .post<AuthResponsePayload>(
            environment.firebaseEmailPasswordEndpoint +
              'signupNewUser?key=' +
              environment.authApiKey,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(respData => {
              return this.handleAuthentication(respData);
            }),
            catchError(AuthEffects.handleError)
          );
      })
    );
  });

  authLogin = createEffect(() => {
    return this.actions.pipe(
      ofType(
        AuthActions.loginStart
      ) /* Only keep the actions with type LOGIN_START */,
      switchMap(action => {
        return this.http
          .post<AuthResponsePayload>(
            environment.firebaseEmailPasswordEndpoint +
              'verifyPassword?key=' +
              environment.authApiKey,
            {
              email: action.email,
              password: action.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map(respData => {
              return this.handleAuthentication(respData);
            }),
            catchError(AuthEffects.handleError)
          );
      })
    );
  });

  authAutoLogin = createEffect(() => {
    return this.actions.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        if (!this.cookieSvc.check(AppConstants.userKey)) {
          return AuthActions.logout();
        }
        const user = JSON.parse(this.cookieSvc.get(AppConstants.userKey));
        if (!user) {
          return AuthActions.logout();
        }
        const loadedUser = new UserModel(
          user.email,
          user.localId,
          user.idToken,
          new Date(user.tokenExpirationDate)
        );
        if (!loadedUser.token) {
          return AuthActions.logout();
        }
        const expDuration =
          new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
        return AuthActions.authenticateSuccess({
          email: user.email,
          localId: user.localId,
          idToken: user.idToken,
          tokenExpirationDate: new Date(user.tokenExpirationDate),
          redirect: this.location.path() === '/auth',
        });
      })
    );
  });

  authLogout = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.cookieSvc.delete(AppConstants.userKey);
          this.router.navigate(['auth']);
        })
      );
    },
    { dispatch: false }
  );

  authRedirect = createEffect(
    () => {
      return this.actions.pipe(
        ofType(AuthActions.authenticateSuccess),
        tap(action => {
          if (action.redirect) {
            this.router.navigate(['recipes']);
          }
        })
      );
    },
    { dispatch: false }
  );

  private static handleError(errorResp: HttpErrorResponse): Observable<Action> {
    let errMsg = 'An unknown error occurred!';
    if (!errorResp.error || !errorResp.error.error) {
      // return throwError(errMsg) is wrong.
      // Must return an non-error observable such that the inner
      // observable won't die.
      return of(AuthActions.authenticateFail({ errorMessage: errMsg }));
    }
    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errMsg = 'This email already exists!';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errMsg = 'Too many attempts. Try later!';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errMsg = 'Email/password sign up is disabled!';
        break;
      case 'EMAIL_NOT_FOUND':
        errMsg = 'Email not found!';
        break;
      case 'INVALID_PASSWORD':
        errMsg = 'Incorrect password!';
        break;
      case 'USER_DISABLED':
        errMsg = 'Email is disabled';
        break;
    }
    return of(AuthActions.authenticateFail({ errorMessage: errMsg }));
  }

  private handleAuthentication(respData: AuthResponsePayload): Action {
    const expDuration = Number(respData.expiresIn) * 1000;
    const newExpDate = new Date(new Date().getTime() + expDuration);
    const user = new UserModel(
      respData.email,
      respData.localId,
      respData.idToken,
      newExpDate
    );
    this.cookieSvc.set(AppConstants.userKey, JSON.stringify(user), newExpDate);
    return AuthActions.authenticateSuccess({
      email: respData.email,
      localId: respData.localId,
      idToken: respData.idToken,
      tokenExpirationDate: newExpDate,
      redirect: true,
    });
  }
}
