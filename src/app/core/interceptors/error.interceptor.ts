import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/error/api-error.model';
import { ErrorService } from '../services/error/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      // Costruisce ApiError dal body Spring oppure fallback
      const apiError: ApiError = isApiError(err.error)
        ? err.error
        : {
            status: err.status,
            error: 'Unknown error',
            message: err.message ?? 'Unexpected error occurred',
            path: req.url,
            timestamp: new Date().toISOString()
          };

      // Gestione centralizzata per status comuni
      switch (apiError.status) {
        case 0:
          errorService.set('Cannot reach the server. Check your connection.');
          break;
        case 401:
          // Non reindirizzare se è la chiamata di /me (check autenticazione silenzioso)
          if (!req.url.includes('/auth/me')) {
            globalThis.location.href = '/login';
          }
          break;
        case 403:
          errorService.set('You do not have permission to perform this action.');
          break;
        case 429:
          errorService.set('Too many requests. Please wait and try again.');
          break;
        case 503:
          errorService.set('Service temporarily unavailable. Please try again later.');
          break;
      }

      // Propaga sempre l'errore al componente per gestione locale
      return throwError(() => apiError);
    })
  );
};

function isApiError(body: unknown): body is ApiError {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    'message' in body &&
    'path' in body &&
    'timestamp' in body
  );

}
