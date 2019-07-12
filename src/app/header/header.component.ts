import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStore: DataStorageService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authSvc.userSubject.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogOut() {
    this.authSvc.logOut();
  }

  onSaveData() {
    this.dataStore.storeRecipes();
  }

  onFetchData() {
    const sub = this.dataStore.fetchRecipes().subscribe(recipes => {
      sub.unsubscribe();
    });
  }
}
