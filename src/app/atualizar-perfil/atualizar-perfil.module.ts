import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtualizarPerfilPageRoutingModule } from './atualizar-perfil-routing.module';

import { AtualizarPerfilPage } from './atualizar-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtualizarPerfilPageRoutingModule
  ]
})
export class AtualizarPerfilPageModule {}
