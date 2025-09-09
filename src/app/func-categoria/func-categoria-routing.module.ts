import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuncCategoriaPage } from './func-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: FuncCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuncCategoriaPageRoutingModule {}
