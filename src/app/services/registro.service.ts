import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, docData } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export type TipoMidia = 'imagem' | 'video' | 'audio' | null;

export interface MeuDia {
  tipoMidia: TipoMidia;
  id?: string;
  titulo: string;
  diaSemana: string;
  horario: string;
  createdAt?: number;
  midiaUrl?: string;
  reproduzindo?: boolean;
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

        // Início do dia atual (00:00)
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const inicioDoDia = hoje.getTime();

        const q = query(
          colRef,
          where('createdAt', '>=', inicioDoDia),
          orderBy('createdAt', 'desc')
        );

        return collectionData(q, { idField: 'id' }) as Observable<MeuDia[]>;
      })
    );
  }

  // NOVO: Buscar registro por ID
  getRegistroPorId(id: string): Observable<MeuDia | undefined> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of(undefined);

        const docRef = doc(this.firestore, `users/${u.uid}/meuDia/${id}`);
        return docData(docRef, { idField: 'id' }) as Observable<MeuDia>;
      })
    );
  }

  async addItem(item: MeuDia) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const colRef = collection(this.firestore, `users/${currentUser.uid}/meuDia`);
    return addDoc(colRef, { ...item, createdAt: Date.now() });
  }

  // ATUALIZADO: Update completo do registro
  async updateItem(item: MeuDia) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    if (!item.id) throw new Error('ID do registro é obrigatório para atualização');

    const docRef = doc(this.firestore, `users/${currentUser.uid}/meuDia/${item.id}`);
    return updateDoc(docRef, {
      titulo: item.titulo,
      diaSemana: item.diaSemana,
      horario: item.horario,
      midiaUrl: item.midiaUrl,
      tipoMidia: item.tipoMidia,
      // createdAt não é atualizado - mantém a data original
    });
  }

  async deleteItem(id: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const docRef = doc(this.firestore, `users/${currentUser.uid}/meuDia/${id}`);
    return deleteDoc(docRef);
  }
}
