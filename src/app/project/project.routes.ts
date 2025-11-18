import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ManageProjectComponent } from './components/manage-project/manage-project.component';
import { WorkProjectComponent } from './components/work-project/work-project.component';

export const projectRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { hideSidebar: false } 
  },
  {
    path: 'create',
    component: CreateProjectComponent,
    data: { hideSidebar: false } 
  },
  {
    path: 'manage/:id',
    component: ManageProjectComponent,
    data: { hideSidebar: false } 
  },
  {
    path: 'work/:id',
    component: WorkProjectComponent,
    data: { hideSidebar: false } 
  }
];