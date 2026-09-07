import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private readonly FORGOT_URL = API.password.forgot;
  private readonly RESET_URL = API.password.reset;

  constructor(private readonly http: HttpClient) {}

  /**
   * POST /api/v1/password/request?email=...
   * Invia la mail di reset password.
   */
  requestReset(email: string): Observable<void> {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>(this.FORGOT_URL, null, {
      params,
      withCredentials: true
    });
  }

  /**
   * POST /api/v1/password/reset?token=...&password=...
   * Imposta la nuova password.
   */
  resetPassword(token: string, password: string): Observable<void> {
    const params = new HttpParams()
      .set('token', token)
      .set('password', password);
    return this.http.post<void>(this.RESET_URL, null, {
      params,
      withCredentials: true
    });
  }

}
