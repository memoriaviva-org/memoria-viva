import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService, Flashcard } from '../services/flashcard.service';
import { of, firstValueFrom, map } from 'rxjs';
import { AudioPreferenceService } from '../services/audio-preference.service';

@Component({
  selector: 'app-func-categoria',
  templateUrl: './func-categoria.page.html',
  styleUrls: ['./func-categoria.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FuncCategoriaPage {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false

  categoria: string = '';
  categoriaImg: string = '';

  mostrarConfirmacao = false;
  mostrarMensagemSucesso = false;
  mostrarAlertDeletarErro = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flashcardService: FlashcardService,
    private audioPref: AudioPreferenceService
  ) {}


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

  getClasseCategoria(nome: string): string {
    const classes: any = {
      'Família': 'categoria-familia',
      'Amigos': 'categoria-amigos',
      'Passatempos': 'categoria-passatempos',
      'Infância': 'categoria-infancia',
      'Juventude': 'categoria-juventude',
      'Animais de Estimação': 'categoria-animais',
      'Momentos Marcantes': 'categoria-momentos'
    };
    return classes[nome] || 'categoria-default';
  }


  // Navegar para a página de flashcards
  irParaFlashcards() {
    this.router.navigate(['/flashcard'], { queryParams: { categoria: this.categoria } });
  }

  // Navegar para gerenciar flashcards
  irParaGerenciar() {
    this.router.navigate(['/gerenciar-flashcards'], { queryParams: { categoria: this.categoria } });
  }

  // Navegar para criar flashcard
  irParaAdicionar() {
    this.router.navigate(['/criar-flashcard'], { queryParams: { categoria: this.categoria } });
  }

  // deletar categoria
  async deletarFlashcardsDaCategoria() {
    if (!this.categoria) {
      console.error('Categoria não definida');
      return;
    }

    const confirmacao = confirm(
      `Tem certeza que deseja excluir todos os flashcards da categoria "${this.categoria}"?`
    );
    if (!confirmacao) return;

    try {
      const flashcards = await firstValueFrom(
        this.flashcardService.verFlashcardsPorCategoria(this.categoria)
      );

      if (!flashcards.length) {
        alert('Nenhum flashcard encontrado nesta categoria.');
        return;
      }

      // Apaga todos os flashcards encontrados
      for (const flashcard of flashcards) {
        if (flashcard.id) {
          await this.flashcardService.deleteFlashcard(flashcard.id);
        }
      }

      console.log('Todos os flashcards da categoria foram excluídos.');
      alert('Flashcards excluídos com sucesso.');
      this.router.navigate(['/categorias']);
    } catch (error) {
      console.error('Erro ao excluir flashcards da categoria:', error);
      alert('Erro ao excluir flashcards.');
    }
  }

  naoExcluir() {
    this.mostrarConfirmacao = false;
  }

  confirmarExclusao() {
    this.mostrarConfirmacao = false;
  }

  // Botão voltar
  voltar() {
    this.router.navigate(['/categorias']);
  }

  // Botão início
  inicio() {
    this.router.navigate(['/home']);
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  async ngAfterViewInit() {
    await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
  }

  toggleAudio() {
    this.audioPref.toggleAudio(this.audioPlayer);
  }
}
