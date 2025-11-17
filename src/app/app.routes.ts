import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { projectRoutes } from './project/project.routes';
import { userRoutes } from './user/user.routes';
import { artistRoutes } from './artist/artist.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    children: authRoutes
  },
  {
    path: 'project',
    children: projectRoutes,
  },
  {
    path: 'user',
    children: userRoutes
  },
  {
    path: 'artist',
    children: artistRoutes
  },

  { path: '**', redirectTo: 'auth/login' }
];
