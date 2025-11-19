import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private hasBirthDateSubject = new BehaviorSubject<boolean>(false);
  public hasBirthDate$ = this.hasBirthDateSubject.asObservable();

  constructor(
    private firestore: Firestore
  ) {}

  // Verifica se o usuário tem data de nascimento cadastrada
  async checkUserBirthDate(uid: string): Promise<boolean> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const hasBirthDate = userData && userData['dataNasc'];
        this.hasBirthDateSubject.next(!!hasBirthDate);
        return !!hasBirthDate;
      }

      this.hasBirthDateSubject.next(false);
      return false;
    } catch (error) {
      console.error('Erro ao verificar data de nascimento:', error);
      this.hasBirthDateSubject.next(false);
      return false;
    }
  }

  // Atualiza o estado quando o usuário adiciona a data de nascimento
  setBirthDateStatus(hasBirthDate: boolean) {
    this.hasBirthDateSubject.next(hasBirthDate);
  }
}
