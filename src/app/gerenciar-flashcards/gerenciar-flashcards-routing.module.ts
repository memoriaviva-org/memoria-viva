import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GerenciarFlashcardsPage } from './gerenciar-flashcards.page';

const routes: Routes = [
  {
    path: '',
    component: GerenciarFlashcardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciarFlashcardsPageRoutingModule {}
