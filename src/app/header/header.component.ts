import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  constructor(private dataStore: DataStorageService) {}

  ngOnInit() {}

  onSaveData() {
    this.dataStore.storeRecipes();
  }

  onFetchData() {
    this.dataStore.fetchRecipes().subscribe();
  }
}
