import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meu-dia-registros',
  templateUrl: './meu-dia-registros.page.html',
  styleUrls: ['./meu-dia-registros.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})

  export class MeuDiaRegistrosPage {

  constructor() {}

  mostrarJanela = false

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
  }

}
