export interface CreateExaminationRequest {
  readonly register: string;
  readonly courseName: string;
  readonly degreeCourseName: string;
  readonly courseCfu: string;
  readonly grade: number;
  readonly withHonors: boolean;
  readonly date: string; // ISO date (yyyy-MM-dd)
}
