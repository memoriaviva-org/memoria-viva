// src/app/guards/birthdate.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserDataService } from '../services/user-data.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BirthdateGuard implements CanActivate {
  constructor(
    private userDataService: UserDataService,
    private authService: AuthService
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser().pipe(take(1)).toPromise();

    if (!user) {
      return false;
    }
    return true;
  }
}
