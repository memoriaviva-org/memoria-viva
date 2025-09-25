import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

export interface Flashcard {
  titulo: string;
  pergunta: string;
  resposta: string;
  categoria: string;
  midiaAuxiliar?: string; // base64
  audioPergunta?: string; // base64
  audioResposta?: string; // base64
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  private flashcardsRef = collection(this.firestore, 'flashcards');

  constructor(private firestore: Firestore) {}

  addFlashcard(flashcard: Flashcard) {
    return addDoc(this.flashcardsRef, flashcard);
  }
}
