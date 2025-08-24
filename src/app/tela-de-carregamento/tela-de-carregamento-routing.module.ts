import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaDeCarregamentoPage } from './tela-de-carregamento.page';

const routes: Routes = [
  {
    path: '',
    component: TelaDeCarregamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelaDeCarregamentoPageRoutingModule {}
