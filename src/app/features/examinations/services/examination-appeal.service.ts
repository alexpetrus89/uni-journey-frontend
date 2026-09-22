import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExaminationAppeal } from '../models/examination-appeal.model';

@Injectable({ providedIn: 'root' })
export class ExaminationAppealService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/examination-appeal';

  getAvailableAppeals(): Observable<ExaminationAppeal[]> {
    return this.http.get<ExaminationAppeal[]>(`${this.baseUrl}/available/student`);
  }

  getBookedAppeals(): Observable<ExaminationAppeal[]> {
    return this.http.get<ExaminationAppeal[]>(`${this.baseUrl}/booked/student`);
  }

  bookAppeal(id: number): Observable<ExaminationAppeal> {
    return this.http.post<ExaminationAppeal>(`${this.baseUrl}/booked/${id}`, {});
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete-booked/${id}`);
  }
}
