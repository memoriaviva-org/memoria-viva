import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contatos',
  templateUrl: './add-contatos.page.html',
  styleUrls: ['./add-contatos.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule ],
})
export class AddContatosPage {

 constructor() {}

 mostrarJanela = false;
 mostrarMensagemSucesso = false;
 mostrarConfirmacao = false;
 
  mostrarJanelaMais() {
    this.mostrarJanela = !this.mostrarJanela
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
