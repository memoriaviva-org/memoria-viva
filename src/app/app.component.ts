import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private auth: Auth
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('📱 Plataforma:', this.platform.platforms());
      this.setupAuthListener();
    });
  }

  private setupAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('✅ Usuário autenticado:', user.email);
      } else {
        console.log('❌ Usuário não autenticado');
      }
    });
  }
}