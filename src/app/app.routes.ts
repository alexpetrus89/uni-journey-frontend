import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
/**
 * Loads the children routes for the 'home' path lazily.
 * The routes are loaded only when the 'home' path is navigated to.
 * The routes are loaded from the 'home.routes' file.
 * @returns {Promise<Routes>} A promise containing the children routes.
 */
    loadChildren: (): Promise<Routes> =>
      import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'login',
/**
 * Load the children routes for the 'login' path.
 * This will load the routes configured in the 'login.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'login' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'login' feature.
 */
    loadChildren: (): Promise<Routes> =>
      import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
/**
 * Load the children routes for the 'catalog' path.
 * This will load the routes configured in the 'catalog.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'catalog' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'catalog' feature.
 */
  {
  path: 'catalog',
  loadChildren: () =>
    import('./features/catalog/catalog.routes')
      .then(m => m.CATALOG_ROUTES)
  },
/**
 * Load the children routes for the 'registration' path.
 * This will load the routes configured in the 'registration.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'registration' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'registration' feature.
 */
  {
    path: 'registration',
    loadChildren: () =>
      import('./features/registration/registration.routes')
        .then(m => m.REGISTRATION_ROUTES)
  },
/**
 * Load the children routes for the 'forgot-password' path.
 * This will load the routes configured in the 'forgot-password.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'forgot-password' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'forgot-password' feature.
 */
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./features/password/forgot-password.routes')
        .then(m => m.FORGOT_PASSWORD_ROUTES)
  },
/**
 * Load the children routes for the 'reset-password' path.
 * This will load the routes configured in the 'reset-password.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'reset-password' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'reset-password' feature.
 */
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./features/password/reset-password.routes')
        .then(m => m.RESET_PASSWORD_ROUTES)
  },
/**
 * Load the children routes for the 'user_student' path.
 * This will load the routes configured in the 'user_student.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'user_student' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'user_student' feature.
 */
  {
    path: 'user_student/student-home',
    loadChildren: () =>
      import('./features/student/student.routes')
        .then(m => m.STUDENT_ROUTES)
  },
/**
 * Load the children routes for the 'study_plan' path.
 * This will load the routes configured in the 'study_plan.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'study_plan' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'study_plan' feature.
 */
  {
    path: 'study_plan',
    loadChildren: () =>
      import('./features/study_plan/study_plan.routes')
        .then(m => m.STUDY_PLAN_ROUTES)
  },
/**
 * Load the children routes for the 'examinations' path.
 * This will load the routes configured in the 'examinations.routes' file.
 * The routes are loaded lazily, meaning they are only loaded when the 'examinations' path is navigated to.
 * @returns {Promise<Routes>} A promise that resolves to the routes for the 'examinations' feature.
 */
  {
    path: 'examinations',
    loadChildren: () =>
      import('./features/examinations/examinations.routes')
        .then(m => m.EXAMINATIONS_ROUTES),
  }
];

