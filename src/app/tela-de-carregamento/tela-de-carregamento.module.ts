import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TelaDeCarregamentoPage } from './tela-de-carregamento.page';

import { TelaDeCarregamentoPageRoutingModule } from './tela-de-carregamento-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelaDeCarregamentoPageRoutingModule,
    TelaDeCarregamentoPage
  ],
})
export class TelaDeCarregamentoPageModule {}
