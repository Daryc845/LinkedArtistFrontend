import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { projectRoutes } from './project/project.routes';
import { profileRoutes } from './profile/profile.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    children: authRoutes
  },
  {
    path: 'project',
    children: projectRoutes
  },
  {
    path: 'profile',
    children: profileRoutes
  },

  { path: '**', redirectTo: 'auth/login' }
];
