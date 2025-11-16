import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Task {
  id: number;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['../project-styles.css', './create-project.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class CreateProjectComponent {

  showSkillsDropdown: boolean = false;
  newTaskName: string = '';
  editingTaskId: number | null = null;
  taskIdCounter: number = 1;

  project = {
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

  constructor(private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {}

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

  onSubmit(): boolean {
    
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
    if (this.onSubmit()){
      this.snackBar.open('Creando proyecto: ' + this.project, 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });

      // BACKEND CREATE PROJECT LOGIC HERE

      this.snackBar.open('Proyecto creado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['../dashboard'], { relativeTo: this.route });
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