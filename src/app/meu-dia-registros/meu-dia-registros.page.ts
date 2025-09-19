import { Component, OnInit } from '@angular/core';
import { RegistroService, MeuDia } from '../services/registro.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-meu-dia-registros',
  templateUrl: './meu-dia-registros.page.html',
  styleUrls: ['./meu-dia-registros.page.scss'],
  standalone: false
})
export class MeuDiaRegistrosPage implements OnInit {
  registrosAgrupados$!: Observable<{ [dia: string]: MeuDia[] }>;
  mostrarJanela = false;
  mostrarConfirmacao = false;

  constructor(private registroService: RegistroService) {}

  ngOnInit() {
    this.registrosAgrupados$ = this.registroService.verMeuDia().pipe(
      map(registros => {
        const grupos: { [dia: string]: MeuDia[] } = {};
        for (const r of registros) {
          if (!grupos[r.diaSemana]) grupos[r.diaSemana] = [];
          grupos[r.diaSemana].push(r);
        }
        return grupos;
      })
    );
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


