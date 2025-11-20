// components/work-project/work-project.component.ts

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { WorkProjectService } from '../../services/work-project.service';
import { UpdateTaskStateRequest } from '../../models/requests/manage-project.requests';
import { Project, Task, Member } from '../../models/manage-project.model';

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
  projectId: number = 0;

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
    members: [],
    requests: []
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private workProjectService: WorkProjectService
  ) {}

  ngOnInit(): void {
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
        if (response.code && response.code >= 200 && response.code < 300) {
          this.project.id = id;
          this.project.title = response.data.name;
          this.project.description = response.data.description;
          this.project.category = response.data.category;
          this.project.skills = response.data.skills.map(s => s.name);

          this.organizeTasks(response.data.tasks);
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
    this.project.tasks = {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    };

    tasks.forEach(task => {
      const localTask: Task = {
        id: task.taskId,
        name: task.name,
        assignee: undefined,
        userEmail: undefined,
        userNickname: undefined
      };

      if (task.userEmail && task.userEmail !== 'Sin email') {
        localTask.assignee = `${task.userName || ''} ${task.userLastname || ''}`.trim();
        localTask.userEmail = task.userEmail;
        localTask.userNickname = task.userName || 'Sin alias';
      }

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
        if (response.code && response.code >= 200 && response.code < 300) {
          this.project.members = response.data.members.map(m => ({
            id: m.userid,
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

  // ========== DRAG AND DROP ==========
  
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
    
    // Validaciones de movimiento (igual que manage-project)
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

    // Mover la tarea
    const sourceIndex = this.project.tasks[sourceColumn].indexOf(this.draggedTask);
    if (sourceIndex > -1) {
      const taskToMove = this.draggedTask;
      
      const stateMap = {
        'todo': 'to be done',
        'inProgress': 'in progress',
        'review': 'under review',
        'done': 'done'
      };

      const request: UpdateTaskStateRequest = {
        taskId: taskToMove.id,
        state: stateMap[targetColumn] as any
      };

      this.workProjectService.updateTaskState(request).subscribe({
        next: (response) => {
          if (response.code && response.code >= 200 && response.code < 300) {
            this.project.tasks[sourceColumn].splice(sourceIndex, 1);
            this.project.tasks[targetColumn].push(taskToMove);
            
            this.snackBar.open('Tarea movida exitosamente', 'Cerrar', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error updating task state:', error);
          this.snackBar.open('Error al mover la tarea', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          // Revertir cambio
          this.loadProject(this.projectId);
        }
      });
    }

    this.draggedTask = null;
    this.draggedFromColumn = '';
  }

  // ========== MODALES ==========
  
  showMembersModal(): void {
    this.showMembersListModal = true;
  }

  closeMembersModal(): void {
    this.showMembersListModal = false;
  }
}