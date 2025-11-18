import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';

export const artistRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard', component: DashboardComponent, data: { hideSidebar: false }  },
  { path: ':id', component: ArtistProfileComponent, data: { hideSidebar: false }  }
];
