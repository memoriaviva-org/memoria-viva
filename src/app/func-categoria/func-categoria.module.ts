import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuncCategoriaPageRoutingModule } from './func-categoria-routing.module';

import { FuncCategoriaPage } from './func-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuncCategoriaPageRoutingModule,
    FuncCategoriaPage
  ],
})
export class FuncCategoriaPageModule {}
