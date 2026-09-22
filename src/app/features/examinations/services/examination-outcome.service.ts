import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExaminationOutcome } from '../models/examination-outcome.model';

@Injectable({ providedIn: 'root' })
export class ExaminationOutcomeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/examination-outcome';

  getStudentOutcomes(): Observable<ExaminationOutcome[]> {
    return this.http.get<ExaminationOutcome[]>(`${this.baseUrl}/read/all`);
  }

  getOutcomeById(id: number): Observable<ExaminationOutcome> {
    return this.http.get<ExaminationOutcome>(`${this.baseUrl}/read/outcome`, {
      params: { id },
    });
  }

  /**
   * Removes the outcome. Used both to confirm an insufficient/absent/failed
   * result and to refuse a passing grade — in both cases the outcome simply
   * stops existing and the appeal is no longer pending for the student.
   */
  deleteOutcome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
