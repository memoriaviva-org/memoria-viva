import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplFlashcardPage } from './expl-flashcard.page';

const routes: Routes = [
  {
    path: '',
    component: ExplFlashcardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplFlashcardPageRoutingModule {}
