// features/catalog/models/course-catalog.model.ts
export interface CourseCatalogItem {
  name: string;
  type: string;
  cfu: number;
  yearOfStudy: number;
  mandatoryCourse: boolean;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
}
