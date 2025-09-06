import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeuDiaPage } from './meu-dia.page';

const routes: Routes = [
  {
    path: '',
    component: MeuDiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeuDiaPageRoutingModule {}
