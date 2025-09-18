// principal-page.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';

import { PrincipalPageRoutingModule } from './principal-routing.module';
import { PrincipalPage } from './principal.page';

import { AuthModule } from '@angular/fire/auth'; 

// Importações do SDK Modular do Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'; // Função para inicializar o app Firebase
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; // Funções para o Firestore
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../../environments/environment'; // Suas configurações do ambiente

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPageRoutingModule,
    AuthModule
  ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Provisão do Firestore
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  declarations: [PrincipalPage]
})
export class PrincipalPageModule {}