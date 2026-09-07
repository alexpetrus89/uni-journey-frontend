import { RoleType } from './registration-request.model';

export interface RegistrationResponse {
  id: string;
  username: string;
  role: RoleType;
  message: string;
  referenceCode: string | null;
}

export interface RegistrationErrorResponse {
  message: string;
  errors?: Record<string, string>;
}
