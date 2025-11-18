import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { hideSidebar: true }  },
  { path: 'register', component: RegisterComponent, data: { hideSidebar: true }  },
  { path: 'recover-password', component: RecoverPasswordComponent, data: { hideSidebar: true } }
];
