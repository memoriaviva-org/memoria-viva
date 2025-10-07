import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FlashcardService, Flashcard } from '../services/flashcard.service'
import { Subscription } from 'rxjs';

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
    private flashcardService: FlashcardService
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

  ngOnInit() {
    this.carregarFlashcardsECategorias();
  }

  ngOnDestroy() {
    if (this.flashcardsSubscription) {
      this.flashcardsSubscription.unsubscribe();
    }
  }

  // Método para carregar flashcards e atualizar categorias
  carregarFlashcardsECategorias() {
    this.flashcardsSubscription = this.flashcardService.verTodosFlashcards()
      .subscribe({
        next: (flashcards: Flashcard[]) => {
          this.atualizarCategoriasComFlashcards(flashcards);
        },
        error: (error) => {
          console.error('Erro ao carregar flashcards:', error);
        }
      });
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
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    const button = document.querySelector('.audio-btn') as HTMLElement;

    // Usa a função que já existe para decidir qual áudio tocar
    const novoSrc = this.existemCategoriasComFlashcards()
      ? 'assets/audio/audio-teste.m4a'      // quando existem categorias
      : 'assets/audio/audio-pequeno.mp3';    // quando não existem categorias

    // Atualiza o src e recarrega
    audio.src = novoSrc;
    audio.load();

    if (audio.paused) {
      button.style.display = 'none';
      audio.style.display = 'block';
      audio.play().catch(err => console.error('Erro ao reproduzir áudio:', err));
    } else {
      audio.pause();
    }

    // Quando o áudio termina, volta ao botão
    audio.onended = () => {
      audio.style.display = 'none';
      button.style.display = 'inline-flex';
    };
  }

  // Método para verificar se existe pelo menos uma categoria com flashcards
  existemCategoriasComFlashcards(): boolean {
    return this.categorias.some(categoria => categoria.possuiFlashcards);
  }
}
