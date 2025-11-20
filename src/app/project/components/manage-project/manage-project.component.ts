import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageProjectService } from '../../services/manage-project.service';
import { Project, Member, Request, Task } from '../../models/manage-project.model';
import { 
  UpdateProjectRequest, 
  UpdateTaskStateRequest, 
  UpdateTaskRequest,
  DeleteTaskRequest, 
  RemoveMemberRequest, 
  AcceptRequestRequest, 
  RejectRequestRequest 
} from '../../models/requests/manage-project.requests';
import { CreateTaskRequest } from '../../models/requests/task.requests';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from '../../services/task.service';

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
    private manageProjectService: ManageProjectService,
    private taskService: TaskService
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

  loadProject(id: number): void {
    this.manageProjectService.getProject(id).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.project.id = id;
          this.project.title = response.data.name;
          this.project.description = response.data.description;
          this.project.category = response.data.category;
          this.project.skills = response.data.skills.map(s => s.name);

          this.organizeTasks(response.data.tasks);

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
    this.project.tasks = {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    };

    tasks.forEach(task => {
      console.log('📝 Procesando tarea del backend:', task);
      
      const localTask: Task = {
        id: task.taskId,  // ✅ Usar el ID real del backend
        name: task.name,
        assignee: undefined,
        userEmail: undefined,
        userNickname: undefined
      };

      // El backend envía userEmail, userName, userLastname
      if (task.userEmail && task.userEmail !== 'Sin email') {
        localTask.assignee = `${task.userName || ''} ${task.userLastname || ''}`.trim();
        localTask.userEmail = task.userEmail;
        // Si el backend envía nickname, usarlo; si no, usar el nombre
        localTask.userNickname = task.userName || 'Sin alias';
      }

      console.log('✅ Tarea procesada:', localTask);

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

  validateVisitProfile(artistId: number): void {
    this.router.navigate([`/artist/${artistId}`]);
  }

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
            panelClass: ['error-snackbar']
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

      this.manageProjectService.updateTaskState(request).subscribe({
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
      projectId: this.projectId,
      name: this.taskForm.name,
      state: 'to be done',
      assignedUserEmail: this.taskForm.assignee
    };

    this.taskService.createTask(request).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open('Tarea añadida exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
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
          this.editingTask!.name = this.taskForm.name;
          this.editingTask!.assignee = this.taskForm.assignee || undefined;

          this.snackBar.open('Tarea actualizada exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          this.closeTaskModal();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar la tarea', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  confirmDeleteTask(): void {
    if (!this.editingTask || !this.editingTaskColumn) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${this.editingTask.name}"?`)) {
      const request: DeleteTaskRequest = {
        projectId: this.projectId,
        taskId: this.editingTask.id
      };

      this.manageProjectService.deleteTask(request).subscribe({
        next: (response) => {
          if (response.code && response.code >= 200 && response.code < 300) {
            const column = this.editingTaskColumn as keyof Project['tasks'];
            const index = this.project.tasks[column].indexOf(this.editingTask!);
            
            if (index > -1) {
              this.project.tasks[column].splice(index, 1);
            }
            
            this.snackBar.open('Tarea eliminada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });

            this.closeTaskModal();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar la tarea', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
  
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
              panelClass: ['success-snackbar']
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
            panelClass: ['error-snackbar']
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
        }
      });
    }
  }
}