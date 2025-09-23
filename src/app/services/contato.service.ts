import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export interface Contato {
  id?: string;
  nome: string;
  relacao: string;
  telefone: string;
  endereco?: string;
  fotoUrl?: string;
  audioUrl?: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  verContatos(): Observable<Contato[]> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of([]);
        const colRef = collection(this.firestore, `users/${u.uid}/contatos`);
        const q = query(colRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Contato[]>;
      })
    );
  }

  async addContato(contato: Contato) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const colRef = collection(this.firestore, `users/${currentUser.uid}/contatos`);
    return addDoc(colRef, { ...contato, createdAt: Date.now() });
  }

  async updateContato(contato: Contato) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const docRef = doc(this.firestore, `users/${currentUser.uid}/contatos/${contato.id}`);
    return updateDoc(docRef, {
      nome: contato.nome,
      relacao: contato.relacao,
      telefone: contato.telefone,
      endereco: contato.endereco,
      fotoUrl: contato.fotoUrl,
      audioUrl: contato.audioUrl
    });
  }

  async deleteContato(id: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');
    const docRef = doc(this.firestore, `users/${currentUser.uid}/contatos/${id}`);
    return deleteDoc(docRef);
  }
}
