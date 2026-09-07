import { Routes } from '@angular/router';
import { CatalogPage } from './pages/catalog/catalog.page';
import { CurriculumPage } from './pages/curriculum/curriculum.page';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    component: CatalogPage
  },
  { path: 'curriculum/:degreeCourseName',
    component: CurriculumPage
  }
];
