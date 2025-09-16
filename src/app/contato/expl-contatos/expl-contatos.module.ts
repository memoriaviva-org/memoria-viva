import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplContatosPageRoutingModule } from './expl-contatos-routing.module';

import { ExplContatosPage } from './expl-contatos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplContatosPageRoutingModule,
    ExplContatosPage
  ],
})
export class ExplContatosPageModule {}
