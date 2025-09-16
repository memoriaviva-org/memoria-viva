import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroService } from '../services/registro.service';

@Component({
  selector: 'app-meu-dia-registros',
  templateUrl: './meu-dia-registros.page.html',
  styleUrls: ['./meu-dia-registros.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
})
export class MeuDiaRegistrosPage implements OnInit {

  mostrarJanela = false;

  constructor(private registroService: RegistroService) {}

  ngOnInit() {
  }

  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela;
  }

  fecharJanelaMais() {
    this.mostrarJanela = false;
  }
}
