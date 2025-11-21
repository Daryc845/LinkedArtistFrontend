import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecoverPasswordService } from '../../services/recover-password.service';
import { ForgetPasswordRequest } from '../../models/requests/forget-password.requests';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrls: ['../../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class RecoverPasswordComponent {
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private recoverPasswordService: RecoverPasswordService
  ) {}

  private validateForm(): boolean {
    if (!this.email) {
      this.snackBar.open('Por favor ingresa tu correo electrónico', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
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

  async validateRecovery(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const request: ForgetPasswordRequest = {
      email: this.email
    };

    try {
      const response = await this.recoverPasswordService.forgetPassword(request).toPromise();
      
      if (response?.data) {
        this.recoverPasswordService.storeRecoveryEmail(this.email);
        
        this.snackBar.open('Código de verificación enviado a tu correo', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['/auth/validate-code']);

      } else {
        this.snackBar.open(response?.message || 'Error al enviar el código de recuperación', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    } catch (error: any) {
      console.error('Error en recuperación de contraseña:', error);
      let errorMessage = 'Error al procesar la solicitud. Por favor, intente nuevamente.';
      
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}