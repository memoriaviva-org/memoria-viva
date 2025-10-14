import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  docData
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export interface Flashcard {
  id?: string;
  tituloFlashcard: string;
  categoriaFlashcard: string;
  curiosidade?: string;
  audioPergunta: string;
  audioResposta: string;
  midiaAuxiliar: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  // NOVO: Buscar flashcard por ID
  getFlashcardPorId(id: string): Observable<Flashcard | undefined> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of(undefined);

        const docRef = doc(this.firestore, `users/${u.uid}/flashcards/${id}`);
        return docData(docRef, { idField: 'id' }) as Observable<Flashcard>;
      })
    );
  }

  // Método para ver TODOS os flashcards (usado em "Minhas Memórias")
  verTodosFlashcards(): Observable<Flashcard[]> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of([]);

        const colRef = collection(this.firestore, `users/${u.uid}/flashcards`);
        const q = query(colRef, orderBy('createdAt', 'desc'));

        return collectionData(q, { idField: 'id' }) as Observable<Flashcard[]>;
      })
    );
  }

  // Método para ver flashcards por categoria específica
  verFlashcardsPorCategoria(categoria: string): Observable<Flashcard[]> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of([]);

        const colRef = collection(this.firestore, `users/${u.uid}/flashcards`);

        // Busca por categoria específica
        const q = query(
          colRef,
          where('categoriaFlashcard', '==', categoria),
          orderBy('createdAt', 'desc')
        );
        return collectionData(q, { idField: 'id' }) as Observable<Flashcard[]>;
      })
    );
  }

  // Adicionar flashcard
  async addFlashcard(flashcard: Flashcard) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    const colRef = collection(this.firestore, `users/${currentUser.uid}/flashcards`);
    return addDoc(colRef, {
      ...flashcard,
      createdAt: Date.now()
    });
  }

  // Atualizar flashcard
  async updateFlashcard(flashcard: Flashcard) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    if (!flashcard.id) throw new Error('ID do flashcard é obrigatório para atualização');

    const docRef = doc(this.firestore, `users/${currentUser.uid}/flashcards/${flashcard.id}`);
    return updateDoc(docRef, {
      tituloFlashcard: flashcard.tituloFlashcard,
      categoriaFlashcard: flashcard.categoriaFlashcard,
      curiosidade: flashcard.curiosidade,
      audioPergunta: flashcard.audioPergunta,
      audioResposta: flashcard.audioResposta,
      midiaAuxiliar: flashcard.midiaAuxiliar
    });
  }

  // Deletar flashcard
  async deleteFlashcard(id: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    const docRef = doc(this.firestore, `users/${currentUser.uid}/flashcards/${id}`);
    return deleteDoc(docRef);
  }
}
