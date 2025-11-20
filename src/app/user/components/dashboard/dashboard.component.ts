import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { UpdateUserRequest } from '../../models/requests/dashboard.requests';
import { User, Skill } from '../../models/dashboard.model';
import { TokenService } from '../../../services/token.service';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
})
export class UserDashboardComponent implements OnInit {
  showSkillsDropdown: boolean = false;
  userId: number = 0;

  user: User = {
    id: 1,
    name: '',
    lastName: '',
    alias: '',
    phone: '',
    email: '',
    password: '',
    skills: [], // Ahora será array de números (IDs)
    bio: ''
  };

  availableSkills: Skill[] = [
    { name: 'Dibujo', id: 1, selected: false },
    { name: 'Pintura', id: 2, selected: false },
    { name: 'Animacion', id: 3, selected: false },
    { name: 'Escultura', id: 4, selected: false },
    { name: 'Grabado', id: 5, selected: false }
  ];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserId()!;
    this.loadUser();
  }

  loadUser(): void {
    this.dashboardService.getUser(this.userId).subscribe({
      next: (response) => {
        console.log(response);
        if (response.code && response.data) {
          this.mapApiResponseToUser(response.data);
        } else {
          this.snackBar.open('Error al cargar los datos del usuario', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los datos del usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading user:', error);
      }
    });
  }

  private mapApiResponseToUser(apiData: any): void {
    this.user.name = apiData.name || '';
    this.user.lastName = apiData.lastname || '';
    this.user.alias = apiData.nickname || '';
    this.user.phone = apiData.cellphone || '';
    this.user.email = apiData.email || '';
    this.user.password = '';
    this.user.bio = apiData.biography || '';
    
    if (apiData.skills && Array.isArray(apiData.skills)) {
      this.user.skills = apiData.skills.map((skill: any) => skill.id || skill.skillId);
      
      // Actualizar el estado selected en availableSkills
      this.availableSkills.forEach(skill => {
        skill.selected = this.user.skills.includes(skill.id);
      });
    } else {
      this.user.skills = [];
    }
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  isSkillSelected(skill: Skill): boolean {
    return this.user.skills.includes(skill.id);
  }

  toggleSkill(skill: Skill): void {
    const index = this.user.skills.indexOf(skill.id);
    if (index > -1) {
      this.user.skills.splice(index, 1);
      skill.selected = false;
    } else {
      this.user.skills.push(skill.id);
      skill.selected = true;
    }
  }

  removeSkill(skillId: number): void {
    const index = this.user.skills.indexOf(skillId);
    if (index > -1) {
      this.user.skills.splice(index, 1);
      
      // Actualizar el estado en availableSkills
      const skill = this.availableSkills.find(s => s.id === skillId);
      if (skill) {
        skill.selected = false;
      }
    }
  }

  getSkillName(skillId: number): string {
    const skill = this.availableSkills.find(s => s.id === skillId);
    return skill ? skill.name : `Skill ${skillId}`;
  }

  private validateForm(): boolean {
    if (!this.user.name.trim() || !this.user.lastName.trim()) {
      this.snackBar.open('Por favor ingresa tus nombres y apellidos', 'Cerrar', {
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
    if (this.validateForm()) {
      this.snackBar.open('Actualizando perfil...', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });

      const updateRequest: UpdateUserRequest = {
        userid: this.userId,
        name: this.user.name,
        lastname: this.user.lastName,
        nickname: this.user.alias || undefined,
        cellphone: this.user.phone,
        email: this.user.email,
        password: this.user.password || undefined,
        skillIds: this.user.skills,
        biography: this.user.bio
      };

      console.log('📤 Enviando request:', updateRequest);

      this.dashboardService.updateUser(updateRequest).subscribe({
        next: (response) => {
          if (response.code && response.code >= 200 && response.code < 300) {
            this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            // Actualizar token si viene en la respuesta
            if (response.body?.token) {
              localStorage.setItem('token', response.body.token);
            }

            // Limpiar contraseña después de guardar
            this.user.password = '';
          } else {
            this.snackBar.open(`Error: ${response.message}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error updating user:', error);
        }
      });
    }
  }

  validateDelete(): void {
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

    this.dashboardService.deleteUser(this.userId).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open('Tu cuenta ha sido eliminada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          // Limpiar datos locales y redirigir
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.router.navigate(['/auth/login']);
          }, 1000);
        } else {
          this.snackBar.open(`Error: No puede eliminar la cuenta mientras tenga proyectos activos`, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar la cuenta', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Error deleting user:', error);
      }
    });
  }
}