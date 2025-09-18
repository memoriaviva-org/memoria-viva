import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importações do SDK Modular do Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'; // Função para inicializar o app Firebase
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; // Funções para o Firestore
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment'; // Suas configurações do ambiente

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Provisão do Firestore
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
