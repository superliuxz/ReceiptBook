import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

import { AppState } from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      /* from userSubject, emit 1 value which is the user of type UserModel, and
       * stops listening, as we are not building an ongoing subscription, but
       * just need one value from the stream. */
      take(1),
      /* Exhaust Observable from take(1), and add the idToken to the query param.
       */
      exhaustMap(authState => {
        if (!authState.user) {
          return next.handle(req);
        }
        return next.handle(
          req.clone({ params: req.params.append('auth', authState.user.token) })
        );
      })
    );
  }
}
