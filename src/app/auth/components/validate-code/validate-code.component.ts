import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { RecoverPasswordService } from '../../services/recover-password.service';
import { ValidateCodePasswordRequest } from '../../models/requests/validate-code-password.requests';

@Component({
  selector: 'app-validate-code',
  standalone: true,
  templateUrl: './validate-code.component.html',
  styleUrls: ['../../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class ValidateCodeComponent {
  code: string = '';
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private recoverPasswordService: RecoverPasswordService
  ) {
    // Obtener el email almacenado
    this.email = this.recoverPasswordService.getStoredRecoveryEmail() || '';
    
    if (!this.email) {
      this.router.navigate(['/auth/recover-password']);
    }
  }

  async validateCode(): Promise<void> {
    if (!this.code || this.code.length !== 6) {
      this.snackBar.open('Por favor ingresa el código de 6 dígitos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.isLoading = true;

    const request: ValidateCodePasswordRequest = {
      email: this.email,
      code: this.code
    };

    try {
        const response = await this.recoverPasswordService.validateCodePassword(request).toPromise();
        
        if (response && response.data) {
        sessionStorage.setItem('confirmation_code', this.code);
        
        this.snackBar.open('Código validado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });

        setTimeout(() => {
            this.router.navigate(['/auth/reset-password']);
        }, 1000);
        
        } else {
        this.snackBar.open(response?.message || 'Código inválido', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
        }
    } catch (error: any) {
        console.error('Error validando código:', error);
        let errorMessage = 'Error al validar el código. Por favor, intente nuevamente.';
        
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
    this.router.navigate(['/auth/recover-password']);
  }
}