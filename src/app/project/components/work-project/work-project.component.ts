import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { WorkProjectService } from '../../services/work-project.service';
import { UpdateTaskStateRequest } from '../../models/requests/work-project.requests';
import { Project, Task, Member } from '../../models/work-project.model';

@Component({
  standalone: true,
  selector: 'app-work-project',
  templateUrl: './work-project.component.html',
  styleUrls: ['./work-project.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, HttpClientModule],
})
export class WorkProjectComponent implements OnInit {
  showMembersListModal: boolean = false;
  draggedTask: Task | null = null;
  draggedFromColumn: string = '';

  // ID del proyecto desde la URL
  projectId: number = 0;

  // Proyecto local - DATOS QUEMADOS (se cargarán del backend)
  project: Project = {
    id: 1,
    title: '',
    description: '',
    category: '',
    skills: [],
    tasks: {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    },
    members: []
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private workProjectService: WorkProjectService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del proyecto desde la URL
    this.projectId = Number(this.route.snapshot.params['id']);
    
    if (this.projectId) {
      this.loadProject(this.projectId);
    } else {
      this.snackBar.open('ID de proyecto no válido', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/project/dashboard']);
    }
  }

  /**
   * Cargar proyecto desde el backend
   * Endpoint: GET /projects/{id}
   */
  loadProject(id: number): void {
    this.workProjectService.getProject(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Transformar la respuesta del backend al formato local
          this.project.id = id;
          this.project.title = response.data.title;
          this.project.description = response.data.description;
          this.project.category = response.data.category;
          this.project.skills = response.data.skills.map(s => s.name);

          this.organizeTasks(response.data.tasks);

          // Cargar miembros
          this.loadMembers(id);
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar el proyecto', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading project:', error);
      }
    });
  }

  /**
   * Organizar tareas del backend en columnas
   */
  organizeTasks(tasks: any[]): void {
    let taskId = 1;
    
    this.project.tasks = {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    };

    tasks.forEach(task => {
      const localTask: Task = {
        id: taskId++,
        name: task.name,
        assignee: task.user ? `${task.user.name} ${task.user.lastname}` : undefined,
        state: task.state
      };

      switch (task.state) {
        case 'to be done':
          this.project.tasks.todo.push(localTask);
          break;
        case 'in progress':
          this.project.tasks.inProgress.push(localTask);
          break;
        case 'under review':
          this.project.tasks.review.push(localTask);
          break;
        case 'done':
          this.project.tasks.done.push(localTask);
          break;
      }
    });
  }

  /**
   * Cargar miembros del proyecto
   * Endpoint: GET /projects/{id}/members
   */
  loadMembers(projectId: number): void {
    this.workProjectService.getMembers(projectId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.project.members = response.data.members.map(m => ({
            id: m.userId,
            name: `${m.name} ${m.lastname}`,
            alias: m.nickname,
            email: m.email,
            isOwner: m.isOwner
          }));
        }
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }

  /**
   * Navegar al perfil de un usuario
   */
  validateVisitProfile(artistId: number): void {
    this.router.navigate([`/artist/${artistId}`]);
  }

  onDragStart(event: DragEvent, task: Task, column: string): void {
    this.draggedTask = task;
    this.draggedFromColumn = column;
    (event.target as HTMLElement).classList.add('dragging');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetColumn: keyof Project['tasks']): void {
    event.preventDefault();
    
    if (!this.draggedTask || !this.draggedFromColumn) return;

    const sourceColumn = this.draggedFromColumn as keyof Project['tasks'];
    
    if (sourceColumn === 'todo' && targetColumn !== 'todo' && !this.draggedTask.assignee) {
      this.snackBar.open('No puedes mover una tarea sin encargado a otra columna', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      this.draggedTask = null;
      this.draggedFromColumn = '';
      return;
    }

    if (sourceColumn !== 'todo' && targetColumn === 'todo') {
      this.snackBar.open('No puedes mover una tarea de regreso a "Por hacer"', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      this.draggedTask = null;
      this.draggedFromColumn = '';
      return;
    }

    if (sourceColumn === 'todo' && targetColumn === 'todo') {
      const sourceIndex = this.project.tasks[sourceColumn].indexOf(this.draggedTask);
      if (sourceIndex > -1) {
        this.project.tasks[sourceColumn].splice(sourceIndex, 1);
        this.project.tasks[targetColumn].push(this.draggedTask);
      }
      this.draggedTask = null;
      this.draggedFromColumn = '';
      return;
    }

    const sourceIndex = this.project.tasks[sourceColumn].indexOf(this.draggedTask);
    if (sourceIndex > -1) {
      this.project.tasks[sourceColumn].splice(sourceIndex, 1);
    }

    this.project.tasks[targetColumn].push(this.draggedTask);

    // Actualizar en el backend
    const stateMap: { [key: string]: 'to be done' | 'in progress' | 'under review' | 'done' } = {
      'todo': 'to be done',
      'inProgress': 'in progress',
      'review': 'under review',
      'done': 'done'
    };

    const request: UpdateTaskStateRequest = {
      projectid: this.projectId,
      taskid: this.draggedTask.id,
      name: this.draggedTask.name,
      state: stateMap[targetColumn]
    };

    this.workProjectService.updateTaskState(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Tarea movida exitosamente', 'Cerrar', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open(`Error: ${response.message}`, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error updating task state:', error);
        // Revertir el cambio si falla
        this.loadProject(this.projectId);
      }
    });

    this.draggedTask = null;
    this.draggedFromColumn = '';
  }

  showMembersModal(): void {
    this.showMembersListModal = true;
  }

  closeMembersModal(): void {
    this.showMembersListModal = false;
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    this.router.navigate(['/auth/login']);
  }
}