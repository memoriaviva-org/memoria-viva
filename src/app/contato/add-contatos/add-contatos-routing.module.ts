import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddContatosPage } from './add-contatos.page';

const routes: Routes = [
  {
    path: '',
    component: AddContatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddContatosPageRoutingModule {}
