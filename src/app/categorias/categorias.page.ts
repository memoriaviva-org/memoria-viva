import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CategoriasPage {
  constructor(private router: Router) {}

  mostrarJanela = false;

  abrirCategoria(nomeCategoria: string) {
    this.router.navigate(['/func-categoria'], { queryParams: { categoria: nomeCategoria } });
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

}




