import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RecoverPasswordService } from '../../services/recover-password.service';
import { ResetPasswordRequest } from '../../models/requests/reset-password.requests';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  email: string = '';
  confirmationCode: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private recoverPasswordService: RecoverPasswordService
  ) {}

  ngOnInit(): void {
    // Obtener el email y código almacenados
    this.email = this.recoverPasswordService.getStoredRecoveryEmail() || '';
    this.confirmationCode = sessionStorage.getItem('confirmation_code') || '';
    
    if (!this.email || !this.confirmationCode) {
      this.snackBar.open('Sesión expirada. Por favor, inicia el proceso nuevamente.', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      this.router.navigate(['/auth/recover-password']);
    }
  }

  private validateForm(): boolean {
    if (!this.newPassword || !this.confirmPassword) {
      this.snackBar.open('Por favor completa todos los campos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (this.newPassword.length < 6) {
      this.snackBar.open('La contraseña debe tener al menos 6 caracteres', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    return true;
  }

  async resetPassword(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const request: ResetPasswordRequest = {
      email: this.email,
      newPassword: this.newPassword,
      confirmationCode: this.confirmationCode
    };

    try {
      const response = await this.recoverPasswordService.resetPassword(request).toPromise();
      
      if (response && response.success) {
        this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Limpiar datos de sesión
        this.recoverPasswordService.clearStoredRecoveryEmail();
        sessionStorage.removeItem('confirmation_code');

        // Redirigir al login
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
        
      } else {
        this.snackBar.open(response?.message || 'Error al actualizar la contraseña', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    } catch (error: any) {
      console.error('Error actualizando contraseña:', error);
      let errorMessage = 'Error al actualizar la contraseña. Por favor, intente nuevamente.';
      
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

  goBack(): void {
    this.router.navigate(['/auth/validate-code']);
  }
}