import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authSvc.userSubject.pipe(
      /* IMPORTANT, as we don't want the guard to keep listening to the
       * userSubject, but rather, only take one value from it, and stop
       * listening, and move onto the |map| operator. */
      take(1),
      map(user => {
        return !!user ? true : this.router.createUrlTree(['/auth']);
      })
    );
  }
}
