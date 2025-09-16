import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private firestore: AngularFirestore) {}

  salvarRegistro(titulo: string, diaSemana: string, horario: string): Promise<void> {
    const id = this.firestore.createId();
    const registro = {
      titulo,
      diaSemana,
      horario,
      criadoEm: new Date()
    };
    return this.firestore.collection('registros').doc(id).set(registro);
  }
}
