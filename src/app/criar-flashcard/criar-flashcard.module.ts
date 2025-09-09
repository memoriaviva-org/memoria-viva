import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriarFlashcardPageRoutingModule } from './criar-flashcard-routing.module';

import { CriarFlashcardPage } from './criar-flashcard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriarFlashcardPageRoutingModule,
    CriarFlashcardPage
  ],
})
export class CriarFlashcardPageModule {}
