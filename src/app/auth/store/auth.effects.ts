import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AppConstants } from '../../app-constants';
import { RecipesResolverService } from '../../recipes/recipes-resolver.service';
import { AuthService } from '../auth.service';
import { UserModel } from '../user.model';
import {
  AUTHENTICATE_SUCCESS,
  AuthenticateFail,
  AuthenticateSuccess,
  AUTO_LOGIN,
  LOGIN_START,
  LoginStart,
  Logout,
  LOGOUT,
  SIGNUP_START,
  SignupStart,
} from './auth.actions';

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
    private authSvc: AuthService,
    private recipesResolver: RecipesResolverService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @Effect()
  authSignup = this.actions.pipe(
    ofType(SIGNUP_START),
    switchMap((signUpData: SignupStart) => {
      return this.http
        .post<AuthResponsePayload>(
          AppConstants.firebaseEmailPasswordEndpoint +
            'signupNewUser?key=' +
            AppConstants.firebaseApiKey,
          {
            email: signUpData.payload.email,
            password: signUpData.payload.password,
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

  @Effect()
  authLogin = this.actions.pipe(
    ofType(LOGIN_START) /* Only keep the actions with type LOGIN_START */,
    switchMap((authData: LoginStart) => {
      return this.http
        .post<AuthResponsePayload>(
          AppConstants.firebaseEmailPasswordEndpoint +
            'verifyPassword?key=' +
            AppConstants.firebaseApiKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
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

  @Effect()
  authAutoLogin = this.actions.pipe(
    ofType(AUTO_LOGIN),
    map(() => {
      const user = JSON.parse(localStorage.getItem(AppConstants.userKey));
      if (!user) {
        return new Logout();
      }
      const loadedUser = new UserModel(
        user.email,
        user.localId,
        user.idToken,
        new Date(user.tokenExpirationDate)
      );
      if (!loadedUser.token) {
        return new Logout();
      }
      const expDuration =
        new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
      this.authSvc.setLogoutTimer(expDuration);
      return new AuthenticateSuccess({
        email: user.email,
        localId: user.localId,
        idToken: user.idToken,
        tokenExpirationDate: new Date(user.tokenExpirationDate),
        redirect: false,
      });
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions.pipe(
    ofType(LOGOUT),
    tap(() => {
      this.authSvc.clearLogoutTimer();
      localStorage.removeItem(AppConstants.userKey);
      this.router.navigate(['auth']);
    })
  );

  @Effect({
    // Let ngrx know that this effect dies not dispatch an action.
    dispatch: false,
  })
  authRedirect = this.actions.pipe(
    ofType(AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthenticateSuccess) => {
      // Manually run the resolver to fetch the data, such that we won't see
      // a glimpse of the authenticated auth page when the request is ongoing.
      // const recipes = this.recipesResolver.resolve(
      //   this.route.snapshot,
      //   this.router.routerState.snapshot
      // );
      // if (recipes instanceof Observable) {
      //   recipes.subscribe();
      // }
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['recipes']);
      }
    })
  );

  private static handleError(
    errorResp: HttpErrorResponse
  ): Observable<AuthenticateFail> {
    let errMsg = 'An unknown error occurred!';
    if (!errorResp.error || !errorResp.error.error) {
      // return throwError(errMsg) is wrong.
      // Must return an non-error observable such that the inner
      // observable won't die.
      return of(new AuthenticateFail(errMsg));
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
    return of(new AuthenticateFail(errMsg));
  }

  private handleAuthentication(
    respData: AuthResponsePayload
  ): AuthenticateSuccess {
    const expDuration = Number(respData.expiresIn) * 1000;
    const newExpDate = new Date(new Date().getTime() + expDuration);
    const user = new UserModel(
      respData.email,
      respData.localId,
      respData.idToken,
      newExpDate
    );
    localStorage.setItem(AppConstants.userKey, JSON.stringify(user));
    this.authSvc.setLogoutTimer(expDuration);
    return new AuthenticateSuccess({
      email: respData.email,
      localId: respData.localId,
      idToken: respData.idToken,
      tokenExpirationDate: newExpDate,
      redirect: true,
    });
  }
}
