import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-func-categoria',
  templateUrl: './func-categoria.page.html',
  styleUrls: ['./func-categoria.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FuncCategoriaPage {
  categoria: string = '';
  categoriaImg: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Pega o parâmetro enviado pela rota via queryParams
    this.route.queryParams.subscribe(params => {
      this.categoria = params['categoria'] || '';
      this.categoriaImg = this.getImagemCategoria(this.categoria);
    });
  }

  getImagemCategoria(nome: string): string {
    const imagens: any = {
      'Família': 'assets/img/categoria_familia.png',
      'Amigos': 'assets/img/categoria_amigos.png',
      'Passatempos': 'assets/img/categoria_passatempos.png',
      'Infância': 'assets/img/categoria_infancia.png',
      'Juventude': 'assets/img/categoria_juventude.png',
      'Animais de Estimação': 'assets/img/categoria_animais_de_estimacao.png',
      'Momentos Marcantes': 'assets/img/categoria_momentos_marcantes.png'
    };
    return imagens[nome] || 'assets/img/categorias/default.png';
  }

  // Navegar para a página de flashcards
  irParaFlashcards() {
    this.router.navigate(['/flashcard'], { queryParams: { categoria: this.categoria } });
  }

  // Navegar para gerenciar flashcards
  irParaGerenciar() {
    this.router.navigate(['/gerenciar-flashcards'], { queryParams: { categoria: this.categoria } });
  }

  // Navegar para adicionar flashcard
  irParaAdicionar() {
    this.router.navigate(['/adicionar-flashcard'], { queryParams: { categoria: this.categoria } });
  }

  // Botão voltar
  voltar() {
    this.router.navigate(['/categorias']);
  }

  // Botão início
  inicio() {
    this.router.navigate(['/home']);
  }
}
