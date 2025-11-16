import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { F } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule
  ]
})
export class RegisterComponent {

  fullName: string = '';
  artistName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(): boolean {
    
    if (!this.fullName || !this.email || !this.phone || !this.password) {
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

  validateRegister(): void {

    if (this.onSubmit()) {
      this.snackBar.open('Iniciando sesión...', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      
      //BACKEND REGISTER SUCCESS LOGIC HERE

      this.snackBar.open('Se ha registrado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.router.navigate(['../login']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}