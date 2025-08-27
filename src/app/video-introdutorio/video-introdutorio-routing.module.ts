import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoIntrodutorioPage } from './video-introdutorio.page';

const routes: Routes = [
  {
    path: '',
    component: VideoIntrodutorioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoIntrodutorioPageRoutingModule {}
