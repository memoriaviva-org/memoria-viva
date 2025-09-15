import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class PrincipalPage implements OnInit {
  // Itens referentes ao Áudio:
  isSpeaking = false;
  isPaused = false;
  currentUtterance: SpeechSynthesisUtterance | null = null;
  currentIcon = 'volume-high';

  mostrarJanela = false;

  nome: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        await user.reload(); // <- Garante que o displayName está atualizado
        this.nome = user.displayName ?? 'Usuário';
      } else {
        this.nome = 'Não autenticado';
      }
    });
  }

  speakText() {
    if (this.isSpeaking) {
      if (this.isPaused) {
        // Retomar a fala
        speechSynthesis.resume();
        this.isPaused = false;
        this.currentIcon = 'pause';
      } else {
        // Pausar a fala
        speechSynthesis.pause();
        this.isPaused = true;
        this.currentIcon = 'play';
      }
    } else {
      // Criar e iniciar a fala
      const utterance = new SpeechSynthesisUtterance("Olá, este é um teste de acessibilidade.");
      utterance.lang = "pt-BR";

      // Quando a fala terminar, resetar os estados
      utterance.onend = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.currentIcon = 'volume-high';
      };

      this.currentUtterance = utterance;
      this.isSpeaking = true;
      this.isPaused = false;
      this.currentIcon = 'pause';

      speechSynthesis.speak(utterance);
    }
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

}

