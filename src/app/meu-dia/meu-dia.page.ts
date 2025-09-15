import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meu-dia',
  templateUrl: './meu-dia.page.html',
  styleUrls: ['./meu-dia.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})

  export class MeuDiaPage {

  constructor() {}

  mostrarJanela = false

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

}
