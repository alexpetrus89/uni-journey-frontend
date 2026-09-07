import { environment } from "../../../environments/environment";

const BASE = environment.apiBaseUrl;

export const API = {
  auth: {
    login:   `${BASE}/auth/login`,
    logout:  `${BASE}/auth/logout`,
    me:      `${BASE}/auth/me`,
    profile: `${BASE}/auth/profile`,
  },
  registration: {
    register: `${BASE}/registration`,
  },
  csrf: {
    csrf: `${BASE}/csrf`
  },
  password: {
    forgot: `${BASE}/password/forgot`,
    reset: `${BASE}/password/reset`
  },
  notification: {
    notification: `${BASE}/notification`,
    read: `${BASE}/notification/read`,
    read_all: `${BASE}/notification/read/all`,
  },
  degreeCourse: {
    catalog: `${BASE}/degree-course/catalog`,
  },
  course: {
    readPublic: `${BASE}/course/read/public`,
  },
  study_plan: {
    study_plan: `${BASE}/study-plan`,
    courses: `${BASE}/study-plan/courses`,
    swap: `${BASE}/study-plan/swap`
  }
};
