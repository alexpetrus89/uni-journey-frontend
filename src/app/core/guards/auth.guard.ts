import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth/auth.service';
import { API } from '../../core/config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap(isAuth => {
        if (!isAuth) {
          // redirect al login se non autenticato
          this.router.navigateByUrl(API.auth.login);
        }
      })
    );
  }


}




