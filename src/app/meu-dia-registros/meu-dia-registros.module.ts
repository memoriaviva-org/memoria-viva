import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeuDiaRegistrosPageRoutingModule } from './meu-dia-registros-routing.module';

import { MeuDiaRegistrosPage } from './meu-dia-registros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeuDiaRegistrosPageRoutingModule,
    MeuDiaRegistrosPage
  ]
})
export class MeuDiaRegistrosPageModule {}
