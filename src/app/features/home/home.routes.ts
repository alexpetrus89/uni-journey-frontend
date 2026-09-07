import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
//import { ProfilePage } from './pages/profile/profile.page';
//import { AdminPage } from './pages/admin/admin.page';
import { AuthGuard } from '../../core/guards/auth.guard';

export const HOME_ROUTES: Routes = [
  { path: '',  component: HomePage },
  // { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] }, // protetta
  //{ path: 'admin', component: AdminPage, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } } // solo admin
];
