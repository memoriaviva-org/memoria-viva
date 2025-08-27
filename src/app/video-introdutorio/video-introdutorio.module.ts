import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoIntrodutorioPageRoutingModule } from './video-introdutorio-routing.module';

import { VideoIntrodutorioPage } from './video-introdutorio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoIntrodutorioPageRoutingModule
  ]
})
export class VideoIntrodutorioPageModule {}
