export interface Examination {
  readonly courseName: string;
  readonly courseCfu: number;
  readonly grade: number;
  readonly withHonors: boolean;
  readonly date: string; // ISO date (yyyy-MM-dd)
  readonly degreeCourseName: string;
}

export interface BookletSummary {
  readonly totalCfu: number;
  readonly averageGrade: number;
}

/** Computes credits and average grade for the booklet summary cards. */
export function computeBookletSummary(examinations: readonly Examination[]): BookletSummary {
  if (examinations.length === 0) {
    return { totalCfu: 0, averageGrade: 0 };
  }

  const totalCfu = examinations.reduce((sum, exam) => sum + exam.courseCfu, 0);
  const averageGrade =
    examinations.reduce((sum, exam) => sum + exam.grade, 0) / examinations.length;

  return { totalCfu, averageGrade: Math.round(averageGrade * 100) / 100 };
}
