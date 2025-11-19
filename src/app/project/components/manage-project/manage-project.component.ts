import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageProjectService } from '../../services/manage-project.service';
import { Project, Member, Request, Task } from '../../models/manage-project.model';
import { 
  UpdateProjectRequest, 
  CreateTaskRequest, 
  UpdateTaskStateRequest, 
  UpdateTaskRequest, 
  RemoveMemberRequest, 
  AcceptRequestRequest, 
  RejectRequestRequest 
} from '../../models/requests/manage-project.requests';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
})
export class ManageProjectComponent implements OnInit {

  showSkillsDropdown: boolean = false;
  showTaskModal: boolean = false;
  showMembersListModal: boolean = false;
  showRequestsListModal: boolean = false;

  draggedTask: Task | null = null;
  draggedFromColumn: string = '';
  
  editingTask: Task | null = null;
  editingTaskColumn: string = '';
  
  taskForm = {
    name: '',
    assignee: ''
  };

  // ID del proyecto desde la URL
  projectId: number = 0;

  availableSkills = [
    { name: 'Dibujo', id: 1 , selected: false},
    { name: 'Animacion', id: 2 , selected: false},
    { name: 'Escultura', id: 3 , selected: false},
    { name: 'Grabado', id: 4 , selected: false}
  ];

  availableCategories = [
    { categoryId: 4, name: "Stop Motion" },
    { categoryId: 6, name: "Anime" },
    { categoryId: 7, name: "Comic" },
    { categoryId: 8, name: "Oleo" },
    { categoryId: 5, name: "Pixel Art" }
  ];

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
    members: [],
    requests: []
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private manageProjectService: ManageProjectService
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
    this.manageProjectService.getProject(id).subscribe({
      next: (response) => {
        console.log('📥 Proyecto recibido:', response);
        if (response.code && response.code >= 200 && response.code < 300) {
          // Transformar la respuesta del backend al formato local
          this.project.id = id;
          this.project.title = response.data.name;
          this.project.description = response.data.description;
          this.project.category = response.data.category;
          this.project.skills = response.data.skills.map(s => s.name);

          this.organizeTasks(response.data.tasks);

          // Cargar miembros y solicitudes
          this.loadMembers(id);
          this.loadRequests(id);
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
        assignee: task.user ? `${task.user.name} ${task.user.lastname}` : undefined
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
    this.manageProjectService.getMembers(projectId).subscribe({
      next: (response) => {
        if (response.success) {
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
   * Cargar solicitudes del proyecto
   * Endpoint: GET /projects/{id}/requests
   */
  loadRequests(projectId: number): void {
    this.manageProjectService.getRequests(projectId).subscribe({
      next: (response) => {
        if (response.success) {
          this.project.requests = response.data.requests.map(r => ({
            id: r.userid,
            name: `${r.name} ${r.lastname}`,
            alias: r.nickname,
            email: r.email
          }));
        }
      },
      error: (error) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  /**
   * Navegar al perfil de un usuario
   */
  validateVisitProfile(artistId: number): void {
    this.router.navigate([`/artist/${artistId}`]);
  }

  /**
   * Eliminar proyecto
   * Endpoint: DELETE /projects/{id}/delete
   */
  validateDelete(): void {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar el proyecto? Esta acción es irreversible."
    );

    if (!confirmDelete) {
      this.snackBar.open('Operación cancelada', 'Cerrar', {
        duration: 2500,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.manageProjectService.deleteProject(this.projectId).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open('El proyecto ha sido eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
          });
          
          setTimeout(() => {
            this.router.navigate(['/project/dashboard']);
          }, 1000);
        }
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar el proyecto', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error deleting project:', error);
      }
    });
  }
  
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

    const sourceIndex = this.project.tasks[sourceColumn].indexOf(this.draggedTask);
    if (sourceIndex > -1) {
      this.project.tasks[sourceColumn].splice(sourceIndex, 1);
      this.project.tasks[targetColumn].push(this.draggedTask);

      // Actualizar en el backend
      const stateMap = {
        'todo': 'to be done',
        'inProgress': 'in progress',
        'review': 'under review',
        'done': 'done'
      };

      const request: UpdateTaskStateRequest = {
        projectid: this.projectId,
        taskid: this.draggedTask.id,
        name: this.draggedTask.name,
        state: stateMap[targetColumn] as any
      };

      this.manageProjectService.updateTaskState(request).subscribe({
        next: (response) => {
          if (response.code && response.code >= 200 && response.code < 300) {
            this.snackBar.open('Tarea movida exitosamente', 'Cerrar', {
              duration: 2000,
              panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error updating task state:', error);
          // Revertir el cambio si falla
          this.loadProject(this.projectId);
        }
      });
    }

    this.draggedTask = null;
    this.draggedFromColumn = '';
  }
  
  showAddTaskModal(): void {
    this.editingTask = null;
    this.editingTaskColumn = '';
    this.taskForm = { name: '', assignee: '' };
    this.showTaskModal = true;
  }

  openEditTaskModal(task: Task, column: string): void {
    this.editingTask = task;
    this.editingTaskColumn = column;
    this.taskForm = {
      name: task.name,
      assignee: task.assignee || ''
    };
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.editingTask = null;
    this.editingTaskColumn = '';
    this.taskForm = { name: '', assignee: '' };
  }

  showMembersModal(): void {
    this.showMembersListModal = true;
  }

  closeMembersModal(): void {
    this.showMembersListModal = false;
  }

  showRequestModal(): void {
    this.showRequestsListModal = true;
  }

  closeRequestModal(): void {
    this.showRequestsListModal = false;
  }
  
  /**
   * Validar y añadir tarea
   * Endpoint: POST /projects/tasks/create
   */
  validateAddTask(): void {
    if (!this.taskForm.name.trim()) {
      this.snackBar.open('Por favor ingresa el nombre de la tarea', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (this.taskForm.assignee) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.taskForm.assignee)) {
        this.snackBar.open('Por favor ingresa un email válido', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
    }

    const request: CreateTaskRequest = {
      projectid: this.projectId,
      name: this.taskForm.name,
      email: this.taskForm.assignee || undefined
    };

    this.manageProjectService.createTask(request).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open('Tarea añadida exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
          });
          
          this.loadProject(this.projectId);
          this.closeTaskModal();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al crear la tarea', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error creating task:', error);
      }
    });
  }

  /**
   * Validar y actualizar tarea
   * Endpoint: PUT /projects/tasks/update
   */
  validateUpdateTask(): void {
    if (!this.taskForm.name.trim()) {
      this.snackBar.open('Por favor ingresa el nombre de la tarea', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (this.taskForm.assignee) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.taskForm.assignee)) {
        this.snackBar.open('Por favor ingresa un email válido', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
    }

    if (!this.editingTask || !this.editingTaskColumn) return;

    const stateMap = {
      'todo': 'to be done',
      'inProgress': 'in progress',
      'review': 'under review',
      'done': 'done'
    };

    const request: UpdateTaskRequest = {
      projectid: this.projectId,
      taskid: this.editingTask.id,
      name: this.taskForm.name,
      state: stateMap[this.editingTaskColumn as keyof typeof stateMap] as any,
      email: this.taskForm.assignee || undefined
    };

    this.manageProjectService.updateTask(request).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          // Actualizar localmente
          this.editingTask!.name = this.taskForm.name;
          this.editingTask!.assignee = this.taskForm.assignee || undefined;

          this.snackBar.open('Tarea actualizada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
          });

          this.closeTaskModal();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar la tarea', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error updating task:', error);
      }
    });
  }

  /**
   * Confirmar y eliminar tarea
   */
  confirmDeleteTask(): void {
    if (!this.editingTask || !this.editingTaskColumn) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${this.editingTask.name}"?`)) {
      const column = this.editingTaskColumn as keyof Project['tasks'];
      const index = this.project.tasks[column].indexOf(this.editingTask);
      
      if (index > -1) {
        this.project.tasks[column].splice(index, 1);
        
        this.snackBar.open('Tarea eliminada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
        });

        // TODO: Implementar endpoint de eliminación de tarea en el backend si existe
        
        this.closeTaskModal();
      }
    }
  }
  
  /**
   * Eliminar miembro
   * Endpoint: DELETE /projects/member
   */
  removeMember(member: Member): void {
    if (member.isOwner) {
      this.snackBar.open('No puedes eliminar al propietario del proyecto', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar a ${member.name} del proyecto?`)) {
      const request: RemoveMemberRequest = {
        projectid: this.projectId,
        userid: member.id
      };

      this.manageProjectService.removeMember(request).subscribe({
        next: (response) => {
          if (response.code && response.code >= 200 && response.code < 300) {
            const index = this.project.members.indexOf(member);
            if (index > -1) {
              this.project.members.splice(index, 1);
            }
            
            this.snackBar.open('Integrante eliminado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar el integrante', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error removing member:', error);
        }
      });
    }
  }
  /**
   * Aceptar solicitud
   * Endpoint: POST /projects/requests/accept
   */
  acceptRequest(request: Request): void {
    const acceptRequest: AcceptRequestRequest = {
      projectid: this.projectId,
      userid: request.id
    };

    this.manageProjectService.acceptRequest(acceptRequest).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open(`${request.name} ha sido aceptado en el proyecto`, 'Cerrar', {
            duration: 2500,
            panelClass: ['code && response.code >= 200 && response.code < 300-snackbar']
          });

          this.project.members.push({
            id: request.id,
            name: request.name,
            alias: request.alias,
            email: request.email,
            isOwner: false
          });

          this.project.requests = this.project.requests.filter(r => r.id !== request.id);
        }
      },
      error: (error) => {
        this.snackBar.open('Error al aceptar la solicitud', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error accepting request:', error);
      }
    });
  }

  /**
   * Rechazar solicitud
   * Endpoint: POST /projects/requests/decline
   */
  rejectRequest(request: Request): void {
    const rejectRequest: RejectRequestRequest = {
      projectid: this.projectId,
      userid: request.id
    };

    this.manageProjectService.rejectRequest(rejectRequest).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open(`Solicitud de ${request.name} rechazada`, 'Cerrar', {
            duration: 2500,
            panelClass: ['warning-snackbar']
          });

          this.project.requests = this.project.requests.filter(r => r.id !== request.id);
        }
      },
      error: (error) => {
        this.snackBar.open('Error al rechazar la solicitud', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error rejecting request:', error);
      }
    });
  }
  
  /**
   * Validar formulario del proyecto
   */
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

  getSkillIdByName(skillName: string): number | null {
    const skill = this.availableSkills.find(s => s.name === skillName);
    return skill ? skill.id : null;
  }

  getCategoryIdByName(categoryName: string): number | null {
    const category = this.availableCategories.find(c => c.name === categoryName);
    return category ? category.categoryId : null;
  }

  /**
   * Actualizar información del proyecto
   * Endpoint: PUT /projects/update
   */
  validateUpdate(): void {
    if (this.onSubmit()) {
      const request: UpdateProjectRequest = {
        projectId: this.projectId,
        title: this.project.title,
        description: this.project.description,
        categoryId: this.getCategoryIdByName(this.project.category)!,
        skills: this.project.skills.map(s => ({ skillId: this.getSkillIdByName(s)! }))
      };

      this.manageProjectService.updateProject(request).subscribe({
        next: (response) => {
          
          if (response.code && response.code >= 200 && response.code < 300) {
            this.snackBar.open('Proyecto actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar el proyecto', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error updating project:', error);
        }
      });
    }
  }
}