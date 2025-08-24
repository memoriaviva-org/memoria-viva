import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tela-de-carregamento',
  templateUrl: './tela-de-carregamento.page.html',
  styleUrls: ['./tela-de-carregamento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TelaDeCarregamentoPage {

  showLogo = false;
  showTextoPrincipal = false;
  showMemoriaVivaTexto = false;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.showLogo = true;
    }, 1000);
    setTimeout(() => {
      this.showTextoPrincipal = true;
    }, 1000);
    setTimeout(() => {
      this.showMemoriaVivaTexto = true;
    }, 1000);
  }
}
