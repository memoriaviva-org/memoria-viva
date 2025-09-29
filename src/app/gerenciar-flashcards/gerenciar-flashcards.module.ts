import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { GerenciarFlashcardsPage } from './gerenciar-flashcards.page';

@NgModule({
  declarations: [GerenciarFlashcardsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: GerenciarFlashcardsPage }]) 
  ]
})

export class GerenciarFlashcardsPageModule {}
