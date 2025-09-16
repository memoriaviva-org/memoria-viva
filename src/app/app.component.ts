import { Component } from '@angular/core';

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => any;
    };
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {

}
