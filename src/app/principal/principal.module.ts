import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PrincipalPage } from './principal.page';

import { PrincipalPageRoutingModule } from './principal-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPageRoutingModule,
    PrincipalPage
  ],
})
export class PrincipalPageModule {}
