import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AudioConfigPageRoutingModule } from './audio-config-routing.module';

import { AudioConfigPage } from './audio-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AudioConfigPageRoutingModule
  ]
})
export class AudioConfigPageModule {}
