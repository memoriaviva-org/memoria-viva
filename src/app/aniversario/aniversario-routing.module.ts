import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AniversarioPage } from './aniversario.page';

const routes: Routes = [
  {
    path: '',
    component: AniversarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AniversarioPageRoutingModule {}