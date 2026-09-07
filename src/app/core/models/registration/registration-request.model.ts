export type RoleType = 'STUDENT' | 'PROFESSOR' | 'ADMIN';

export interface BaseRegistrationRequest {
  username: string;
  password: string;
  confirm: string;
  firstName: string;
  lastName: string;
  dob: string;
  fiscalCode: string;
  street: string;
  city: string;
  country: string;
  zip: string;
  phone: string;
  role: RoleType;
}

export interface StudentRegistrationRequest extends BaseRegistrationRequest {
  role: 'STUDENT';
  degreeCourseId: string | null;
  degreeCourseName: string | null;
  ordering: string;
}

export interface ProfessorRegistrationRequest extends BaseRegistrationRequest {
  role: 'PROFESSOR';
}

export interface AdminRegistrationRequest extends BaseRegistrationRequest {
  role: 'ADMIN';
}

export type RegistrationRequest =
  | StudentRegistrationRequest
  | ProfessorRegistrationRequest
  | AdminRegistrationRequest;
