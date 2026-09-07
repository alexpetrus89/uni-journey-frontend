import { CourseDto } from "../../course/models/course.model";


export interface StudyPlanDto {
  ordering: string;
  courses: CourseDto[];
}

export interface SwapCourseRequest {
  courseToAdd: string;
  degreeCourseOfNewCourse: string;
  courseToRemove: string;
  degreeCourseOfOldCourse: string;
}
export { CourseDto };

