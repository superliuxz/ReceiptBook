import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../app-constants';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponsePayload {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* Use BehaviorSubject to get the previously emitted value. We not only want
   * the reactive change (Subject), but because the authentication, we also want
   * to know the current value of the user. Initial value is null as not
   * authenticated.
   * See https://stackoverflow.com/questions/43348463/what-is-the-difference-between-subject-and-behaviorsubject
   */
  userSubject = new BehaviorSubject<UserModel>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  logOut(): void {
    localStorage.removeItem(AppConstants.userKey);
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    // If the user click the Log Out button, also clear the timer.
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  login(email: string, password: string): Observable<AuthResponsePayload> {
    return this.http
      .post<AuthResponsePayload>(
        AppConstants.firebaseEmailPasswordEndpoint +
          'verifyPassword?key=' +
          AppConstants.firebaseApiKey,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem(AppConstants.userKey));
    if (!user) {
      return;
    }
    const loadedUser = new UserModel(
      user.email,
      user.localId,
      user.idToken,
      new Date(user.tokenExpirationDate)
    );
    if (!loadedUser.token) {
      return;
    }
    this.userSubject.next(loadedUser);
    const tokenDurationLeft =
      new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(tokenDurationLeft);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  signUp(email: string, password: string): Observable<AuthResponsePayload> {
    console.log(
      AppConstants.firebaseEmailPasswordEndpoint +
        'verifyPassword?key=' +
        AppConstants.firebaseApiKey
    );
    return this.http
      .post<AuthResponsePayload>(
        AppConstants.firebaseEmailPasswordEndpoint +
          'signupNewUser?key=' +
          AppConstants.firebaseApiKey,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  private handleAuthentication(respData: AuthResponsePayload) {
    const user = new UserModel(
      respData.email,
      respData.localId,
      respData.idToken,
      new Date(new Date().getTime() + Number(respData.expiresIn) * 1000)
    );
    this.userSubject.next(user);
    this.autoLogout(Number(respData.expiresIn) * 1000);
    localStorage.setItem(AppConstants.userKey, JSON.stringify(user));
  }

  private handleError(errorResp: HttpErrorResponse) {
    console.log(HttpErrorResponse);
    let errMsg = 'An unknown error occurred!';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errMsg);
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
    return throwError(errMsg);
  }
}
