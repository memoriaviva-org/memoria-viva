import { Component, OnInit } from '@angular/core';
import { RegistroService, MeuDia } from '../services/registro.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-meu-dia-registros',
  templateUrl: './meu-dia-registros.page.html',
  styleUrls: ['./meu-dia-registros.page.scss'],
  standalone: false
})
export class MeuDiaRegistrosPage implements OnInit {
  registros$!: Observable<MeuDia[]>;
  mostrarJanela = false;
  mostrarConfirmacao = false;
  
  constructor(private registroService: RegistroService) {}

  ngOnInit() {
    this.registros$ = this.registroService.verMeuDia();
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }

  mostrarAlertaConfirmacao() {
    this.mostrarConfirmacao = true;
  }

  naoExcluir() {
    this.mostrarConfirmacao = false;
  }
}