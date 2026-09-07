import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseDto, StudyPlanDto, SwapCourseRequest } from '../models/study-plan.model';
import { API } from '../../../core/config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class StudyPlanService {

  constructor(private readonly http: HttpClient) {}

  /**
   * GET /api/v1/study-plan
   * Piano dello studente autenticato.
   */
  getStudyPlan(): Observable<StudyPlanDto> {
    return this.http.get<StudyPlanDto>(API.study_plan.study_plan, { withCredentials: true });
  }

  /**
   * GET /api/v1/study-plan/courses?degreeCourse=X
   * Corsi disponibili per il cambio, esclusi quelli già nel piano.
   */
  getAvailableCourses(degreeCourse: string): Observable<CourseDto[]> {
    const params = new HttpParams().set('degreeCourse', degreeCourse);
    return this.http.get<CourseDto[]>(API.study_plan.courses, {
      params,
      withCredentials: true
    });
  }

  /**
   * PUT /api/v1/study-plan/swap
   * Sostituisce un corso nel piano.
   */
  swapCourse(request: SwapCourseRequest): Observable<StudyPlanDto> {
    return this.http.put<StudyPlanDto>(API.study_plan.swap, request, { withCredentials: true});
  }

}
