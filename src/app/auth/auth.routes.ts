import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ValidateCodeComponent } from './components/validate-code/validate-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { hideSidebar: true }  },
  { path: 'register', component: RegisterComponent, data: { hideSidebar: true }  },
  { path: 'recover-password', component: RecoverPasswordComponent, data: { hideSidebar: true } },
  { path: 'validate-code', component: ValidateCodeComponent, data: { hideSidebar: true } },
  { path: 'reset-password', component: ResetPasswordComponent, data: { hideSidebar: true } }
];
