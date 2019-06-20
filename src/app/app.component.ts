import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  displayPage = 'recipes';

  changeDisplayPage(page: string) {
    this.displayPage = page;
  }
}
