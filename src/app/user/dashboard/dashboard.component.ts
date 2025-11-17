import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class UserDashboardComponent implements OnInit {

  showSkillsDropdown: boolean = false;

  

  user = {
    name: '',
    lastName: '',
    alias: '',
    phone: '',
    email: '',
    password: '',
    skills: [] as string[],
    bio: ''
  };

  payload = {
    name: this.user.name,
    lastName: this.user.lastName,
    nickname: this.user.alias,
    phone: this.user.phone,
    email: this.user.email,
    password: this.user.password,
    skills: this.user.skills,
    biography: this.user.bio
  }

  availableSkills: string[] = [
    'Ilustración',
    'Diseño Gráfico',
    'Diseño 3D',
    'Edición de Fotos',
    'Tipografía',
    'Animación 2D',
    'Animación 3D',
    'Modelado 3D',
    'Concept Art'
  ];

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Aquí cargarías los datos del usuario desde el backend
    this.loaduseruser();
  }

  loaduseruser(): void {
    // Simulación de datos del usuario - reemplazar con llamada al backend
    this.user = {
      name: 'Juan Eernesto',
      lastName: 'Pérez Hernandez',
      alias: 'DJ Shadow',
      phone: '+57 300 123 4567',
      email: 'juan@email.com',
      password: '',
      skills: ['Animación 2D', 'Animación 3D', 'Modelado 3D'],
      bio: 'Productor musical con 10 años de experiencia en géneros electrónicos y urbanos. He trabajado con diversos artistas independientes y siempre busco nuevos proyectos creativos.'
    };
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  isSkillSelected(skill: string): boolean {
    return this.user.skills.includes(skill);
  }

  toggleSkill(skill: string): void {
    const index = this.user.skills.indexOf(skill);
    if (index > -1) {
      this.user.skills.splice(index, 1);
    } else {
      this.user.skills.push(skill);
    }
  }

  removeSkill(skill: string): void {
    const index = this.user.skills.indexOf(skill);
    if (index > -1) {
      this.user.skills.splice(index, 1);
    }
  }

  onSubmit(): boolean {
    
    if (!this.user.name.trim() || !this.user.lastName.trim()) {
      this.snackBar.open('Por favor tus nombres y apellidos', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    
    if (!this.user.phone.trim()) {
      this.snackBar.open('Por favor ingresa tu número de teléfono', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    
    if (!this.user.email.trim()) {
      this.snackBar.open('Por favor ingresa tu correo electrónico', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.snackBar.open('Por favor ingresa un email válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return false;
    }

    
    if (this.user.password && this.user.password.length < 6) {
      this.snackBar.open('La contraseña debe tener al menos 6 caracteres', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return false;
    }

    
    if (this.user.skills.length === 0) {
      this.snackBar.open('Por favor selecciona al menos una habilidad', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    return true;
  }

  validateUpdate(): void {
    if (this.onSubmit()) {
        this.snackBar.open('Actualizando perfil...', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      // BACKEND UPDATE user LOGIC HERE
      // Ejemplo:
      // this.userService.updateuser(this.user).subscribe({
      //   next: (response) => {
      //     this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
      //       duration: 3000,
      //       panelClass: ['success-snackbar']
      //     });
      //   },
      //   error: (error) => {
      //     this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
      //       duration: 3000,
      //       panelClass: ['error-snackbar']
      //     });
      //   }
      // });

      // Simulación de éxito
      this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      // Limpiar contraseña después de guardar
      this.user.password = '';
    }
  }

  validateDelete(): void {
    // Confirmación inicial
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible."
    );

    if (!confirmDelete) {
      this.snackBar.open('Operación cancelada', 'Cerrar', {
        duration: 2500,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Aquí va el backend real
    // this.userService.deleteAccount(this.user.id).subscribe({
    //   next: () => {
    //     ...
    //   },
    //   error: () => {
    //     ...
    //   }
    // });

    // Simulación de eliminación exitosa
    this.snackBar.open('Tu cuenta ha sido eliminada exitosamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    // Simular tiempo de procesamiento antes de salir
    /*setTimeout(() => {
      // Limpieza local si es necesario
      localStorage.removeItem('token');

      // Redirigir al login
      
    }, 1000);*/
    this.router.navigate(['/auth/login']);
  }


  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}