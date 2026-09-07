import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginRequest } from '../../models/login/login-request.model';
import { LoginResponse } from '../../models/login/login-response.model';
import { API } from '../../../core/config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL  = API.auth.login;
  private readonly LOGOUT_URL = API.auth.logout;
  private readonly ME_URL     = API.auth.me;

  constructor(private readonly http: HttpClient) {}

  /**
   * 🔐 LOGIN
   * POST /api/auth/login — JSON body
   * Spring Security handles authentication
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.LOGIN_URL,
      request,                         // JSON automatico
      { withCredentials: true }
    );
  }

  /**
   * 🚪 LOGOUT
   * POST /logout
   */
  logout(): Observable<void> {
    return this.http.post<void>(
      this.LOGOUT_URL,
      null,
      { withCredentials: true }
    );
  }

  /**
   * ✅ Verifica se l'utente è autenticato
   * @returns Observable<boolean>
   */
  isAuthenticated(): Observable<boolean> {
    return this.http.get<LoginResponse>(
      this.ME_URL,
      { withCredentials: true }
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * 👤 Profilo utente autenticato
   */
  getUserProfile(): Observable<LoginResponse | null> {
    return this.http.get<LoginResponse>(
      this.ME_URL,
      { withCredentials: true }
    ).pipe(
      catchError(() => of(null))
    );
  }


}

