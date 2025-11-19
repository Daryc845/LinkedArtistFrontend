import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../models/requests/register.requests';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['../../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule
  ]
})
export class RegisterComponent {
  name: string = '';
  lastName: string = '';
  artistName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar, 
    private registerService: RegisterService
  ) {}

  private validateForm(): boolean {
    if (!this.name || !this.lastName || !this.email || !this.phone || !this.password) {
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

    const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
    if (!phoneRegex.test(this.phone)) {
      this.snackBar.open('Por favor ingresa un número válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (this.password.length < 6) {
      this.snackBar.open('La contraseña debe tener al menos 6 caracteres', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    return true;
  }

  async validateRegister(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.snackBar.open('Registrando cuenta...', 'Cerrar', {
      duration: 3000,
      panelClass: ['warning-snackbar']
    });

    const registerRequest: RegisterRequest = {
      name: this.name,
      lastname: this.lastName,
      nickname: this.artistName,
      email: this.email,
      celphone: this.phone,
      password: this.password
    };

    try {
      const response = await this.registerService.register(registerRequest).toPromise();
      
      if (response && response.code >= 200 && response.code < 300) {
        this.registerService.storeTokens(response.data.access_token, response.data.refresh_token);
        
        this.snackBar.open('Se ha registrado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Según el documento PDF, debe redirigir a /project/dashboard
        this.router.navigate(['/project/dashboard']);
      } else {
        this.showError('Error en el registro. Por favor, intente nuevamente.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      this.showError('Error al registrar. Por favor, intente nuevamente.');
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}