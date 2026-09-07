import { Routes } from "@angular/router";
import { StudyPlanChangePage } from "./pages/change/study-plan-change.page";
import { StudyPlanReadPage } from "./pages/read/study-plan-read.page";
import { StudyPlanSuccessPage } from './pages/success/study-plan-success.page';

export const STUDY_PLAN_ROUTES: Routes = [
  { path: 'read', component: StudyPlanReadPage },
  { path: 'change', component: StudyPlanChangePage },
  { path: 'success', component: StudyPlanSuccessPage }
];
