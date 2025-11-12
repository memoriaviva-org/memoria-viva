import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FlashcardService, Flashcard } from '../services/flashcard.service'
import { Subscription } from 'rxjs';
import { AudioPreferenceService } from '../services/audio-preference.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CategoriasPage implements OnInit, OnDestroy {

  carregando = true; // Flag de carregamento
  constructor(
    private router: Router,
    private flashcardService: FlashcardService,
    private audioPref: AudioPreferenceService
  ) {}

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  mostrarJanela = false;
  private flashcardsSubscription!: Subscription;

  // Array de categorias com informação se possuem flashcards
  categorias = [
    {
      nome: 'Família',
      possuiFlashcards: false,
      imagem: 'assets/img/categoria_familia.png'
    },
    {
      nome: 'Amigos',
      possuiFlashcards: false,
      imagem: '../../assets/img/categoria_amigos.png'
    },
    {
      nome: 'Passatempos',
      possuiFlashcards: false,
      imagem: '../../assets/img/categoria_passatempos.png'
    },
    {
      nome: 'Infância',
      possuiFlashcards: false,
      imagem: '../../assets/img/categoria_infancia.png'
    },
    {
      nome: 'Juventude',
      possuiFlashcards: false,
      imagem: '../../assets/img/categoria_juventude.png'
    },
    {
      nome: 'Animais de Estimação',
      possuiFlashcards: false,
      imagem: '../../assets/img/categoria_animais_de_estimacao.png'
    },
    {
      nome: 'Momentos Marcantes',
      possuiFlashcards: false,
      imagem: '../../assets/img/categoria_momentos_marcantes.png'
    }
  ];
ngOnInit() {}

async ngAfterViewInit() {
  await this.carregarFlashcardsECategorias();
}


  ngOnDestroy() {
    if (this.flashcardsSubscription) {
      this.flashcardsSubscription.unsubscribe();
    }
  }

  // Método para carregar flashcards e atualizar categorias
 async carregarFlashcardsECategorias() {
  try {
    const flashcards = await firstValueFrom(this.flashcardService.verTodosFlashcards());
    this.atualizarCategoriasComFlashcards(flashcards);
    this.carregando = false;

    // garante que o elemento exista antes de chamar o serviço
      if (this.audioPlayer?.nativeElement) {
        const temFlashcards = this.existemCategoriasComFlashcards();
        // escolhe a fonte do áudio antes de tentar autoplay
        this.audioPlayer.nativeElement.src = temFlashcards
          ? 'assets/audio/audio-teste.m4a'
          : 'assets/audio/audio-pequeno.mp3';
        await this.audioPref.autoPlayIfEnabled(this.audioPlayer);
      }
  } catch (error) {
    console.error('Erro ao carregar flashcards:', error);
    this.carregando = false;
  }
}

  // Método para atualizar quais categorias possuem flashcards
  atualizarCategoriasComFlashcards(flashcards: Flashcard[]) {
    // Reseta todas as categorias para false
    this.categorias.forEach(categoria => {
      categoria.possuiFlashcards = false;
    });

    // Para cada flashcard, marca a categoria correspondente como true
    flashcards.forEach(flashcard => {
      const categoriaEncontrada = this.categorias.find(
        cat => cat.nome === flashcard.categoriaFlashcard
      );

      if (categoriaEncontrada) {
        categoriaEncontrada.possuiFlashcards = true;
      }
    });

    console.log('Categorias atualizadas:', this.categorias);
  }

  // Método para forçar atualização (pode ser chamado de outros componentes)
  atualizarCategorias() {
    this.carregarFlashcardsECategorias();
  }

  abrirCategoria(nomeCategoria: string) {
    this.router.navigate(['/func-categoria'], {
      queryParams: { categoria: nomeCategoria }
    });
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  toggleAudio() {
    const audio = this.audioPlayer.nativeElement;
    const temFlashcards = this.existemCategoriasComFlashcards();
    audio.src = temFlashcards
      ? 'assets/audio/audio-teste.m4a'
      : 'assets/audio/audio-pequeno.mp3';
    this.audioPref.toggleAudio(this.audioPlayer);
  }

  existemCategoriasComFlashcards(): boolean {
    return this.categorias.some(c => c.possuiFlashcards);
  }
}
