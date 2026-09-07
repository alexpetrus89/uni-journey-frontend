import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { API } from '../../../core/config/api-endpoints';
import { DegreeCourse } from '../../degree_course/models/degree-course.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private catalog$: Observable<DegreeCourse[]> | null = null;

  constructor(private readonly http: HttpClient) {}

  /**
   * Recupera il catalogo dei corsi di laurea.
   * La prima chiamata esegue la richiesta HTTP.
   * Le chiamate successive ritornano i dati memorizzati in cache lato client.
   */
  getCatalog(): Observable<DegreeCourse[]> {
    this.catalog$ ??= this.http
      .get<DegreeCourse[]>(API.degreeCourse.catalog)
      .pipe(shareReplay(1)); // salva l'ultima emissione per tutte le sottoscrizioni future
    return this.catalog$;
  }

  /**
   * Resetta la cache lato client.
   * Utile se vuoi forzare un aggiornamento dei dati dal server.
   */
  clearCache(): void { this.catalog$ = null; }

}
