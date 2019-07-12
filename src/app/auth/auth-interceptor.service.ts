import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authSvc.userSubject.pipe(
      /* from userSubject, emit 1 value which is the user of type UserModel, and
       * stops listening, as we are not building an ongoing subscription, but
       * just need one value from the stream. */
      take(1),
      /* Exhaust Observable from take(1), and add the token to the query param.
       */
      exhaustMap(user => {
        // For Sign up and Login request, user is null, hence we do not attach
        // the token.
        if (!user) {
          return next.handle(req);
        }
        return next.handle(
          req.clone({ params: req.params.append('auth', user.token) })
        );
      })
    );
  }
}
