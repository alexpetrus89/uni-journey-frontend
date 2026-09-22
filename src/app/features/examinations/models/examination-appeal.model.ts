export interface ExaminationAppeal {
  readonly id: number;
  readonly degreeCourse: string;
  readonly course: string;
  readonly courseCfu: string;
  readonly professorCode: string;
  readonly professorFullName: string;
  readonly description: string;
  readonly date: string; // ISO date (yyyy-MM-dd)
}
