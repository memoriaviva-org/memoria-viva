import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AudioConfigPage } from './audio-config.page';

const routes: Routes = [
  {
    path: '',
    component: AudioConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudioConfigPageRoutingModule {}
