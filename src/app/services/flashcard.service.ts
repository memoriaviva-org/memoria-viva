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
  orderBy
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export interface Flashcard {
  id?: string;
  tituloFlashcard: string;
  categoriaFlashcard: string;
  midiaAuxiliar?: string;
  audioPergunta?: string;
  audioResposta?: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  /**
   * Observa e retorna todos os flashcards do usuário logado, ordenados por data de criação.
   */
  verFlashcards(): Observable<Flashcard[]> {
    return user(this.auth).pipe(
      switchMap(u => {
        if (!u) return of([]);

        const colRef = collection(this.firestore, `users/${u.uid}/flashcards`);
        const q = query(
          colRef,
          orderBy('createdAt', 'desc')
        );

        return collectionData(q, { idField: 'id' }) as Observable<Flashcard[]>;
      })
    );
  }

  /**
   * Adiciona um novo flashcard ao Firestore para o usuário logado.
   */
  async addFlashcard(flashcard: Flashcard) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado. Por favor, faça login.');

    const colRef = collection(this.firestore, `users/${currentUser.uid}/flashcards`);
    // Salva o flashcard com o timestamp de criação
    return addDoc(colRef, { ...flashcard, createdAt: Date.now() });
  }

  /**
   * Atualiza um flashcard existente.
   */
  async updateFlashcard(flashcard: Flashcard) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado. Por favor, faça login.');
    if (!flashcard.id) throw new Error('ID do Flashcard é obrigatório para atualização.');

    const docRef = doc(this.firestore, `users/${currentUser.uid}/flashcards/${flashcard.id}`);

    // CORREÇÃO APLICADA AQUI: Garantindo que os nomes das propriedades
    // (tituloFlashcard e categoriaFlashcard) estão corretos.
    const updateData: any = {
      tituloFlashcard: flashcard.tituloFlashcard,
      categoriaFlashcard: flashcard.categoriaFlashcard,
      midiaAuxiliar: flashcard.midiaAuxiliar,
      audioPergunta: flashcard.audioPergunta,
      audioResposta: flashcard.audioResposta,
    };

    // Remove propriedades undefined para evitar sobrescrever dados com null/undefined no Firestore
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    return updateDoc(docRef, updateData);
  }

  /**
   * Deleta um flashcard pelo ID.
   */
  async deleteFlashcard(id: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado. Por favor, faça login.');

    const docRef = doc(this.firestore, `users/${currentUser.uid}/flashcards/${id}`);
    return deleteDoc(docRef);
  }
}
