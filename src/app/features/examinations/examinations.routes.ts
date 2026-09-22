import { Routes } from '@angular/router';

export const EXAMINATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/examination-menu/examination-menu.component').then(
        (m) => m.ExaminationMenuComponent,
      ),
    title: 'Examination menu',
  },
  {
    path: 'booklet',
    loadComponent: () =>
      import('./pages/booklet/booklet.component').then((m) => m.BookletComponent),
    title: 'Booklet',
  },
  {
    path: 'appeals/available',
    loadComponent: () =>
      import('./pages/appeals-available/appeals-available.component').then(
        (m) => m.AppealsAvailableComponent,
      ),
    title: 'Available appeals',
  },
  {
    path: 'appeals/booked',
    loadComponent: () =>
      import('./pages/appeals-booked/appeals-booked.component').then(
        (m) => m.AppealsBookedComponent,
      ),
    title: 'Booked appeals',
  },
  {
    path: 'outcomes',
    loadComponent: () =>
      import('./pages/outcomes-list/outcomes-list.component').then(
        (m) => m.OutcomesListComponent,
      ),
    title: 'Evaluation',
  },
  {
    path: 'outcomes/:id',
    loadComponent: () =>
      import('./pages/outcome-detail/outcome-detail.component').then(
        (m) => m.OutcomeDetailComponent,
      ),
    title: 'Outcome',
  },
];
