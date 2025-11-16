import { Routes } from '@angular/router';
import { ProfileDashboardComponent } from './dashboard/dashboard.component';
import { NotificationsComponent } from './notifications/notification.component';
// Importa el AuthGuard si quieres proteger estas rutas
// import { AuthGuard } from '../auth/guards/auth.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: ProfileDashboardComponent,
    // canActivate: [AuthGuard] // Descomenta para proteger la ruta
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    // canActivate: [AuthGuard] // Descomenta para proteger la ruta
  }
];

// Si estás usando un módulo en lugar de standalone, usa esto:
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
//
// @NgModule({
//   imports: [RouterModule.forChild(projectRoutes)],
//   exports: [RouterModule]
// })
// export class ProjectRoutingModule { }