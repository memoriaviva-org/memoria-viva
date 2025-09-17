import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expl-contatos',
  templateUrl: './expl-contatos.page.html',
  styleUrls: ['./expl-contatos.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})
export class ExplContatosPage {

  constructor() {}

  mostrarJanela = false

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }
}
