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
  titulo: string;
  categoria: string;
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

  async addFlashcard(flashcard: Flashcard) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado. Por favor, faça login.');
    
    const colRef = collection(this.firestore, `users/${currentUser.uid}/flashcards`);
    return addDoc(colRef, { ...flashcard, createdAt: Date.now() });
  }

  async updateFlashcard(flashcard: Flashcard) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado. Por favor, faça login.');
    if (!flashcard.id) throw new Error('ID do Flashcard é obrigatório para atualização.');

    const docRef = doc(this.firestore, `users/${currentUser.uid}/flashcards/${flashcard.id}`);

    const updateData = {
      titulo: flashcard.titulo,
      categoria: flashcard.categoria,
      midiaAuxiliar: flashcard.midiaAuxiliar,
      audioPergunta: flashcard.audioPergunta,
      audioResposta: flashcard.audioResposta,
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return updateDoc(docRef, updateData);
  }

  async deleteFlashcard(id: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado. Por favor, faça login.');
    
    const docRef = doc(this.firestore, `users/${currentUser.uid}/flashcards/${id}`);
    return deleteDoc(docRef);
  }
}