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
      const utterance = new SpeechSynthesisUtterance("Olá, este é um teste de acessibilidade.");
      utterance.lang = "pt-BR";
      speechSynthesis.speak(utterance);
    }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

}

