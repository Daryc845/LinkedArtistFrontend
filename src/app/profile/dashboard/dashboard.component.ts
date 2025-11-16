import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-profile-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../profile-styles.css', './dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class ProfileDashboardComponent implements OnInit {

  showSkillsDropdown: boolean = false;

  profile = {
    fullName: '',
    alias: '',
    phone: '',
    email: '',
    password: '',
    skills: [] as string[],
    bio: ''
  };

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
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Simulación de datos del usuario - reemplazar con llamada al backend
    this.profile = {
      fullName: 'Juan Pérez',
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
    return this.profile.skills.includes(skill);
  }

  toggleSkill(skill: string): void {
    const index = this.profile.skills.indexOf(skill);
    if (index > -1) {
      this.profile.skills.splice(index, 1);
    } else {
      this.profile.skills.push(skill);
    }
  }

  removeSkill(skill: string): void {
    const index = this.profile.skills.indexOf(skill);
    if (index > -1) {
      this.profile.skills.splice(index, 1);
    }
  }

  onSubmit(): boolean {
    
    if (!this.profile.fullName.trim()) {
      this.snackBar.open('Por favor ingresa tu nombre completo', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    
    if (!this.profile.phone.trim()) {
      this.snackBar.open('Por favor ingresa tu número de teléfono', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    
    if (!this.profile.email.trim()) {
      this.snackBar.open('Por favor ingresa tu correo electrónico', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.profile.email)) {
      this.snackBar.open('Por favor ingresa un email válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return false;
    }

    
    if (this.profile.password && this.profile.password.length < 6) {
      this.snackBar.open('La contraseña debe tener al menos 6 caracteres', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return false;
    }

    
    if (this.profile.skills.length === 0) {
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
      // BACKEND UPDATE PROFILE LOGIC HERE
      // Ejemplo:
      // this.profileService.updateProfile(this.profile).subscribe({
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
      this.profile.password = '';
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
    // this.userService.deleteAccount(this.profile.id).subscribe({
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