// src/app/aniversario/aniversario.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AniversarioPageRoutingModule } from './aniversario-routing.module';

import { AniversarioPage } from './aniversario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AniversarioPageRoutingModule
  ],
  declarations: [AniversarioPage]
})
export class AniversarioPageModule {}