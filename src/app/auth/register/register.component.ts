import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { F } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['../auth-styles.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    HttpClientModule
  ]
})
export class RegisterComponent {

  name: string = '';
  lastName: string = '';
  artistName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  payload = {
      name: this.name,
      lastname: this.lastName,
      nickname: this.artistName,
      email: this.email,
      celphone: this.phone,
      password: this.password
    };

  constructor(private router: Router, private snackBar: MatSnackBar, private http: HttpClient) {}

  onSubmit(): boolean {
    
    if (!this.name || !this.lastName || !this.email || !this.phone || !this.password) {
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

  doPetition(): Promise<boolean> {

    return new Promise((resolve) => {
      this.http.post('http://localhost:8080/auth/register', this.payload)
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

  async validateRegister(): Promise<void> {

    if (this.onSubmit()) {
      this.snackBar.open('Iniciando sesión...', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      
      const success = await this.doPetition();

      if (success) {
        this.snackBar.open('Se ha registrado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.router.navigate(['../login']);
      }else{
        this.snackBar.open('HUBO UN ERRROR LA PTM', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
      //BACKEND REGISTER SUCCESS LOGIC HERE

      
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}