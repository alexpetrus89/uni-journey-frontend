import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationRequest } from '../../../core/models/registration/registration-request.model';
import { RegistrationResponse } from '../../../core/models/registration/registration-response.model';
import { API } from '../../../core/config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private readonly baseUrl = API.registration.register;
  private readonly csrfUrl = API.csrf.csrf;

  constructor(private readonly http: HttpClient) { }

  initializeCsrf(): Observable<unknown> {
    return this.http.get(this.csrfUrl, { withCredentials: true });
  }

  register(request: RegistrationRequest)
    : Observable<RegistrationResponse> {

    return this.http.post<RegistrationResponse>(
      this.baseUrl,
      request,
      { withCredentials: true }
    );
  }

  getOAuth2AuthorizationUrl(provider: 'google' | 'github'): string {
    return `/oauth2/authorization/${provider}`;
  }
}
