// features/catalog/services/curriculum.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseCatalogItem, PageResult } from '../models/course-catalog.model';
import { API } from '../../../core/config/api-endpoints';

@Injectable({ providedIn: 'root' })
export class CurriculumService {

  constructor(private readonly http: HttpClient) {}

  getCoursesByDegreeCourse(degreeCourseName: string): Observable<PageResult<CourseCatalogItem>> {
    return this.http.get<PageResult<CourseCatalogItem>>(
      `${API.course.readPublic}/${encodeURIComponent(degreeCourseName)}`
    );
  }
}
