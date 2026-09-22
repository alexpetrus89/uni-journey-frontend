import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateExaminationRequest } from '../models/create-examination-request.model';
import { Examination } from '../models/examination.model';

@Injectable({ providedIn: 'root' })
export class ExaminationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/examination';

  /** Student's booklet — completed examinations. */
  getBooklet(): Observable<Examination[]> {
    return this.http.get<Examination[]>(`${this.baseUrl}/read/student/register/ajax`);
  }

  /** Accepts a passing grade: registers the examination in the booklet. */
  acceptGrade(request: CreateExaminationRequest): Observable<Examination> {
    return this.http.post<Examination>(`${this.baseUrl}/create`, request);
  }
}
