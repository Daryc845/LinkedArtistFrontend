import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { WorkProjectComponent } from './work-project/work-project.component';
// Importa el AuthGuard si quieres proteger estas rutas
// import { AuthGuard } from '../auth/guards/auth.guard';

export const projectRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard] // Descomenta para proteger la ruta
  },
  {
    path: 'create',
    component: CreateProjectComponent,
    // canActivate: [AuthGuard] // Descomenta para proteger la ruta
  },
  {
    path: 'manage/:id',
    component: ManageProjectComponent,
    // canActivate: [AuthGuard] // Descomenta para proteger la ruta
  },
  {
    path: 'work/:id',
    component: WorkProjectComponent,
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