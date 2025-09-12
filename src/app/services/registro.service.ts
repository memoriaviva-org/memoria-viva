import { Injectable } from '@angular/core';

export interface Registro {
  titulo: string;
  horario: string;
  arquivoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private registros: Registro[] = [];

  constructor() {}

  adicionarRegistro(registro: Registro) {
    this.registros.push(registro);
  }

  listarRegistros(): Registro[] {
    return this.registros;
  }
}
