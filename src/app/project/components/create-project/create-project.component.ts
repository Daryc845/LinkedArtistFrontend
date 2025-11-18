import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/create-project.service';
import { CreateProjectRequest } from '../../models/requests/create-project.requests';
import { CreateProjectResponse } from '../../models/responses/create-project.responses';
import { Project, Task } from '../../models/create-project.model';

@Component({
  standalone: true,
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class CreateProjectComponent {

  showSkillsDropdown: boolean = false;
  newTaskName: string = '';
  editingTaskId: number | null = null;
  taskIdCounter: number = 1;

  project: Project = {
    title: '',
    description: '',
    category: '',
    skills: [] as string[],
    tasks: [] as Task[]
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

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
    private projectService: ProjectService
  ) {}

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  isSkillSelected(skill: string): boolean {
    return this.project.skills.includes(skill);
  }

  toggleSkill(skill: string): void {
    const index = this.project.skills.indexOf(skill);
    if (index > -1) {
      this.project.skills.splice(index, 1);
    } else {
      this.project.skills.push(skill);
    }
  }

  removeSkill(skill: string): void {
    const index = this.project.skills.indexOf(skill);
    if (index > -1) {
      this.project.skills.splice(index, 1);
    }
  }

  addTask(): void {
    if (this.newTaskName.trim()) {
      this.project.tasks.push({
        id: this.taskIdCounter++,
        name: this.newTaskName.trim()
      });
      this.newTaskName = '';
    }
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
  }

  saveTask(): void {
    this.editingTaskId = null;
  }

  deleteTask(index: number): void {
    this.project.tasks.splice(index, 1);
  }

  private validateForm(): boolean {
    if (!this.project.title.trim()) {
      this.snackBar.open('Por favor ingresa un título para el proyecto', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (!this.project.description.trim()) {
      this.snackBar.open('Por favor ingresa una descripción', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (!this.project.category) {
      this.snackBar.open('Por favor selecciona una categoría', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    if (this.project.skills.length === 0) {
      this.snackBar.open('Por favor selecciona al menos una habilidad', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return false;
    }

    return true;
  }

  validateCreate(): void {
    if (this.validateForm()) {
      // Preparar datos para el request según el endpoint
      const createProjectRequest: CreateProjectRequest = {
        title: this.project.title,
        category: this.project.category,
        userId: 'current-user-id', // Aquí se obtiene el id del usuario actual
        skills: this.project.skills.map(skill => ({ name: skill })),
        initialTasks: this.project.tasks.map(task => ({ name: task.name }))
      };

      // Llamar al servicio para crear el proyecto
      this.projectService.createProject(createProjectRequest).subscribe({
        next: (response: CreateProjectResponse) => {
          if (response.success) {
            this.snackBar.open('Proyecto creado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['../dashboard'], { relativeTo: this.route });
          } else {
            this.snackBar.open(`Error: ${response.message}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al crear el proyecto', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error creating project:', error);
        }
      });
    }
  }

  cancel(): void {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios.')) {
      this.router.navigate(['../dashboard'], { relativeTo: this.route });
    }
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}