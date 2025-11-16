import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrls: ['../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule
  ]
})
export class RecoverPasswordComponent {

  email: string = '';
  emailSent: boolean = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(): boolean {

    if (!this.email) {
      this.snackBar.open('Porfavor ingresa tu correo electronico', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.snackBar.open('Porfavor ingresa un email valido', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    //BACKEND RECOVERY LOGIC HERE
    
    this.emailSent = true;
    return true;
  }

  validateRecovery(): void {

    if (this.onSubmit()) {
      //this.router.navigate(['../project/dashboard']);
      this.snackBar.open('Se ha enviado un mensaje de recuperación a su correo ' + this.email, 'Cerrar', {
        duration: 10000,
        panelClass: ['success-snackbar']
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}