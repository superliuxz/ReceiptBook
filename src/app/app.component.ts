import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './auth/store/auth.actions';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    // Inject a platform id.
    @Inject(PLATFORM_ID)
    private platformId
  ) {}

  ngOnInit(): void {
    // Angular Universal allows the first page to be rendered on the server,
    // hence the browser specific APIs, such as localStorage, is not available
    // (in NodeJS).
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(AuthActions.autoLogin());
    }
  }
}
