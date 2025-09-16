import { Component, AfterViewInit } from '@angular/core';

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
export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;

    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        console.log('VLibras loaded and widget initialized');
      } else {
        console.error('VLibras not found on window after script load');
      }
    };

    script.onerror = () => {
      console.error('Failed to load VLibras script');
    };

    document.body.appendChild(script);
  }
}
