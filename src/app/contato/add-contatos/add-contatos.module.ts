import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AddContatosPage } from './add-contatos.page';

@NgModule({
  declarations: [AddContatosPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: AddContatosPage }]) 
  ]
})
export class AddContatosPageModule {}
