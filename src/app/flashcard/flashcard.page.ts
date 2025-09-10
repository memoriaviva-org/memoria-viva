import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class FlashcardPage {

  mostrarJanela = false
  tipoMidia: 'imagem' | 'video' | 'audio' = 'imagem';
  mostrarResposta: boolean = false;

  categoria: string = '';
  categoriaImagem: string = '';
  categoriaTexto: string = '';

  // 👇 Novos atributos para curiosidade
  mostrarCuriosidade: boolean = false;
  curiosidadeTexto: string = 'Aqui vai a curiosidade que o usuário colocar';

  constructor(private route: ActivatedRoute, private router: Router) {
    // captura a categoria da rota
    this.route.paramMap.subscribe(params => {
      const cat = params.get('categoria');
      if (cat) this.setCategoria(cat);
    });

    this.route.queryParams.subscribe(params => {
      if (params['categoria']) this.setCategoria(params['categoria']);
    });
  }

  setCategoria(cat: string) {
    this.categoria = cat;

    switch (cat.toLowerCase()) {
      case 'amigos':
        this.categoriaImagem = '../../assets/img/categoria_amigos.png';
        this.categoriaTexto = 'Amigos';
        break;
      case 'família':
      case 'familia':
        this.categoriaImagem = '../../assets/img/categoria_familia.png';
        this.categoriaTexto = 'Família';
        break;
      case 'momentos marcantes':
        this.categoriaImagem = '../../assets/img/categoria_momentos_marcantes.png';
        this.categoriaTexto = 'Momentos Marcantes';
        break;
      case 'passatempos':
        this.categoriaImagem = '../../assets/img/categoria_passatempos.png';
        this.categoriaTexto = 'Passatempos';
        break;
      case 'infância':
      case 'infancia':
        this.categoriaImagem = '../../assets/img/categoria_infancia.png';
        this.categoriaTexto = 'Infância';
        break;
      case 'juventude':
        this.categoriaImagem = '../../assets/img/categoria_juventude.png';
        this.categoriaTexto = 'Juventude';
        break;
      case 'animais de estimação':
      case 'animais':
        this.categoriaImagem = '../../assets/img/categoria_animais_de_estimacao.png';
        this.categoriaTexto = 'Animais de Estimação';
        break;
      default:
        this.categoriaImagem = '../../assets/img/categoria_default.png';
        this.categoriaTexto = 'Minhas Memórias';
    }
  }

  verResposta() {
    this.mostrarResposta = !this.mostrarResposta;
  }

  proximo() {
    console.log('Próximo flashcard');
  }

  deletar() {
    console.log('Flashcard deletado');
  }

  editar() {
    console.log('Editar flashcard');
  }

  voltar() {
    this.router.navigate(['/categorias']);
  }

  inicio() {
    this.router.navigate(['/home']);
  }

  // 👇 Funções de curiosidade
  abrirCuriosidade() {
    this.mostrarCuriosidade = true;
  }

  fecharCuriosidade() {
    this.mostrarCuriosidade = false;
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }
}
