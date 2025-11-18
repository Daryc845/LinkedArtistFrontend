import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from '../../models/requests/login.requests';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['../../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar, 
    private loginService: LoginService
  ) { }

  private validateForm(): boolean {
    if (!this.email || !this.password) {
      this.snackBar.open('Debe completar todos los campos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.snackBar.open('Por favor ingresa un email válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    return true;
  }

  async validateLogin(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.snackBar.open('Iniciando sesión...', 'Cerrar', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });

    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password
    };

    try {
      const response = await this.loginService.login(loginRequest).toPromise();
      
      if (response && response.success) {
        this.loginService.storeTokens(response.body.access_token, response.body.refresh_token);
        
        this.snackBar.open('Ha iniciado sesión exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['../../project/dashboard']);
      } else {
        this.showError('Las credenciales de usuario no son válidas');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      this.showError('Error al iniciar sesión. Por favor, intente nuevamente.');
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToRecoverPassword(): void {
    this.router.navigate(['/recover-password']);
  }
}