import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeuDiaRegistrosPage } from './meu-dia-registros.page';

const routes: Routes = [
  {
    path: '',
    component: MeuDiaRegistrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeuDiaRegistrosPageRoutingModule {}
