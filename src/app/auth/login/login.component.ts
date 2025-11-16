import { Component, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule
  ]
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(): boolean {

    if (!this.email || !this.password) {
      this.snackBar.open('Debe completar todos los campos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
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

    // BACKEND LOGIN LOGIC HERE

    return true;
    
  }

  validateLogin(): void {

    if (this.onSubmit()) {
      this.snackBar.open('Iniciando sesión...', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });

      //BACKEND LOGIN SUCCESS LOGIC HERE

      this.snackBar.open('Ha iniciado sesión exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.router.navigate(['../../project/dashboard']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToRecoverPassword(): void {
    this.router.navigate(['/recover-password']);
  }
}