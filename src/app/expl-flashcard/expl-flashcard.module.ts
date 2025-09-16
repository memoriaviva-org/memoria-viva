import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplFlashcardPageRoutingModule } from './expl-flashcard-routing.module';

import { ExplFlashcardPage } from './expl-flashcard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplFlashcardPageRoutingModule,
    ExplFlashcardPage
  ]
})
export class ExplFlashcardPageModule {}
