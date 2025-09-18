import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export interface MeuDia {
  id?: string;
  titulo: string;
  diaSemana: string;
  horario: number;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  verMeuDia(): Observable<MeuDia[]> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of([]);
        const colRef = collection(this.firestore, `users/${u.uid}/meuDia`);
        const q = query(colRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<MeuDia[]>;
      })
    );
  }

  async addItem(item: MeuDia) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const colRef = collection(this.firestore, `users/${currentUser.uid}/meuDia`);
    return addDoc(colRef, { ...item, createdAt: Date.now() });
  }

  async updateItem(item: MeuDia) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const docRef = doc(this.firestore, `users/${currentUser.uid}/meuDia/${item.id}`);
    return updateDoc(docRef, {
      titulo: item.titulo,
      diaSemana: item.diaSemana,
      horario: item.horario
    });
  }

  async deleteItem(id: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const docRef = doc(this.firestore, `users/${currentUser.uid}/meuDia/${id}`);
    return deleteDoc(docRef);
  }
}
