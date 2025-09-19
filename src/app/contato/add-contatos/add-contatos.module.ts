import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContatosPageRoutingModule } from './add-contatos-routing.module';

import { AddContatosPage } from './add-contatos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContatosPageRoutingModule,
    AddContatosPage
  ],
})
export class AddContatosPageModule {}
