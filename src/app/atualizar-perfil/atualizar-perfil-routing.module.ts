import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtualizarPerfilPage } from './atualizar-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: AtualizarPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtualizarPerfilPageRoutingModule {}
