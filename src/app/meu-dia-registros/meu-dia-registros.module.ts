import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { MeuDiaRegistrosPage } from './meu-dia-registros.page';

@NgModule({
  declarations: [MeuDiaRegistrosPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MeuDiaRegistrosPage }])
  ]
})
export class MeuDiaRegistrosPageModule {}
