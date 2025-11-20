// src/app/guards/birthdate.guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserDataService } from '../services/user-data.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BirthdateGuard implements CanActivate {
  private userDataService = inject(UserDataService);
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser().pipe(take(1)).toPromise();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // VERIFICA SE TEM DATA DE NASCIMENTO
    const hasBirthDate = await this.userDataService.checkUserBirthDate(user.uid);
    
    if (!hasBirthDate) {
      // Redireciona para a página aniversario
      this.router.navigate(['/aniversario']);
      return false;
    }

    return true;
  }
}