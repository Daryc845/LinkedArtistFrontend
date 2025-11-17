import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    HttpClientModule
  ]
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  payload = {
    email: this.email,
    password: this.password
  };

  constructor(private router: Router, private snackBar: MatSnackBar, private http: HttpClient) { }

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

  doPetition(): Promise<boolean> {

    return new Promise((resolve) => {
      this.http.post('http://localhost:8080/auth/login', this.payload)
        .subscribe({
          next: (response: any) => {
            console.log('Registro exitoso:', response);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            resolve(true);
          },
          error: (error) => {
            console.error('Error en el registro:', error);
            resolve(false);
          }
        });
    });
  }

  async validateLogin(): Promise<void> {

    if (this.onSubmit()) {
      this.snackBar.open('Iniciando sesión...', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });

      const success = await this.doPetition();

      if (success) {
        this.snackBar.open('Ha iniciado sesión exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['../../project/dashboard']);
      } else {
        this.snackBar.open('Las credenciales de usuario no son validas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }

    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToRecoverPassword(): void {
    this.router.navigate(['/recover-password']);
  }
}