import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeuDiaPageRoutingModule } from './meu-dia-routing.module';

import { MeuDiaPage } from './meu-dia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeuDiaPageRoutingModule,
    MeuDiaPage
  ]
})
export class MeuDiaPageModule {}
