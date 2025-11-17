import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Task {
  id: number;
  name: string;
  assignee?: string;
}

interface Member {
  id: number;
  name: string;
  alias?: string;
  email: string;
  isOwner: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks: {
    todo: Task[];
    inProgress: Task[];
    review: Task[];
    done: Task[];
  };
  members: Member[];
  requests: Member[];
}

@Component({
  standalone: true,
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
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

  availableSkills = [
    { name: 'Ilustración', selected: false },
    { name: 'Diseño Gráfico', selected: false },
    { name: 'Diseño 3D', selected: false },
    { name: 'Edición de Fotos', selected: false },
    { name: 'Tipografía', selected: false },
    { name: 'Animación 2D', selected: false },
    { name: 'Animación 3D', selected: false },
    { name: 'Modelado 3D', selected: false },
    { name: 'Concept Art', selected: false }
  ];

  categories = [
    'Ilustración',
    'Diseño Digital',
    'Branding',
    'Animación',
    'Arte 3D',
    'Edición y Fotografía'
  ];

  project: Project = {
    id: 1,
    title: 'Colección de Ilustraciones Experimentales',
    description: 'Proyecto artístico que busca crear una colección de ilustraciones con técnicas experimentales.',
    category: 'Ilustración',
    skills: ['Ilustración', 'Concept Art', 'Diseño Gráfico'],
    tasks: {
      todo: [
        { id: 1, name: 'Definir estilo visual', assignee: 'María López' },
        { id: 2, name: 'Crear moodboard' }
      ],
      inProgress: [
        { id: 3, name: 'Bocetos iniciales', assignee: 'Carlos Ruiz' }
      ],
      review: [
        { id: 4, name: 'Revisión de composición' }
      ],
      done: [
        { id: 5, name: 'Reunión inicial', assignee: 'Ana García' },
        { id: 6, name: 'Referencias recopiladas' }
      ]
    },
    members: [
      { id: 1, name: 'Juan Pérez', alias: 'JuanArt', email: 'juan@email.com', isOwner: true },
      { id: 2, name: 'María López', alias: 'MaríaDesign', email: 'maria@email.com', isOwner: false },
      { id: 3, name: 'Carlos Ruiz', email: 'carlos@email.com', isOwner: false },
      { id: 4, name: 'Ana García', alias: 'AnaIllustrator', email: 'ana@email.com', isOwner: false }
    ],
    requests : [
    {
      id: 1,
      name: "Laura Hernández",
      alias: "LauraArts",
      email: "laura@email.com",
      isOwner: false
    },
    {
      id: 2,
      name: "Pedro Gómez",
      email: "pedro@email.com",
      isOwner: false
    }
  ]

  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Aquí cargarías el proyecto desde el backend usando el ID de la ruta
    const projectId = this.route.snapshot.params['id'];
    this.loadProject(projectId);
  }

  validateDelete(): void {
    // Confirmación inicial
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
    this.snackBar.open('El proyecto ha sido eliminado correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    // Simular tiempo de procesamiento antes de salir
    /*setTimeout(() => {
      // Limpieza local si es necesario
      localStorage.removeItem('token');

      // Redirigir al login
      
    }, 1000);*/
    this.router.navigate(['/project/dashboard']);
  }

  loadProject(id: string): void {
    // BACKEND LOGIC TO LOAD PROJECT
    // this.projectService.getProject(id).subscribe({
    //   next: (project) => {
    //     this.project = project;
    //   },
    //   error: (error) => {
    //     this.snackBar.open('Error al cargar el proyecto', 'Cerrar', {
    //       duration: 3000,
    //       panelClass: ['error-snackbar']
    //     });
    //   }
    // });
  }

  validateVisitProfile(artistId: number): void {
    this.router.navigate([`/artist/${artistId}`]);
  }

  // Gestión de habilidades
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

  // Drag and Drop
  onDragStart(event: DragEvent, task: Task, column: string): void {
    this.draggedTask = task;
    this.draggedFromColumn = column;
    (event.target as HTMLElement).classList.add('dragging');
  }

  showRequestModal(): void {
    this.showRequestsListModal = true;
  }

  // Cerrar modal
  closeRequestModal(): void {
    this.showRequestsListModal = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetColumn: keyof Project['tasks']): void {
    event.preventDefault();
    
    if (!this.draggedTask || !this.draggedFromColumn) return;

    const sourceColumn = this.draggedFromColumn as keyof Project['tasks'];
    
    // Verificar si la tarea tiene encargado antes de permitir moverla desde "Por hacer"
    if (sourceColumn === 'todo' && targetColumn !== 'todo' && !this.draggedTask.assignee) {
      this.snackBar.open('No puedes mover una tarea sin encargado a otra columna', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      this.draggedTask = null;
      this.draggedFromColumn = '';
      return;
    }

    // No permitir mover de vuelta a "Por hacer" si es desde otra columna
    if (sourceColumn !== 'todo' && targetColumn === 'todo') {
      this.snackBar.open('No puedes mover una tarea de regreso a "Por hacer"', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      this.draggedTask = null;
      this.draggedFromColumn = '';
      return;
    }

    // Si la tarea se está moviendo dentro de "Por hacer", permitirlo (para reordenar)
    if (sourceColumn === 'todo' && targetColumn === 'todo') {
      // Solo reordenar dentro de la misma columna
      const sourceIndex = this.project.tasks[sourceColumn].indexOf(this.draggedTask);
      if (sourceIndex > -1) {
        this.project.tasks[sourceColumn].splice(sourceIndex, 1);
        this.project.tasks[targetColumn].push(this.draggedTask);
      }
      this.draggedTask = null;
      this.draggedFromColumn = '';
      return;
    }

    // Remover de la columna origen
    const sourceIndex = this.project.tasks[sourceColumn].indexOf(this.draggedTask);
    if (sourceIndex > -1) {
      this.project.tasks[sourceColumn].splice(sourceIndex, 1);
    }

    // Añadir a la columna destino
    this.project.tasks[targetColumn].push(this.draggedTask);

    this.draggedTask = null;
    this.draggedFromColumn = '';

    this.snackBar.open('Tarea movida exitosamente', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });

    // BACKEND LOGIC TO UPDATE TASK STATUS
  }

  acceptRequest(request: any): void {
    this.snackBar.open(`${request.name} ha sido aceptado en el proyecto`, 'Cerrar', {
      duration: 2500,
      panelClass: ['success-snackbar']
    });

    // Lo agregas a la lista de miembros
    this.project.members.push({
      id: Date.now(),
      name: request.name,
      alias: request.alias,
      email: request.email,
      isOwner: false
    });

    // Remueves la solicitud
    this.project.requests = this.project.requests.filter(r => r.id !== request.id);

    // BACKEND: aquí envías la aprobación
  }

  rejectRequest(request: any): void {
    this.snackBar.open(`Solicitud de ${request.name} rechazada`, 'Cerrar', {
      duration: 2500,
      panelClass: ['warning-snackbar']
    });

    this.project.requests = this.project.requests.filter(r => r.id !== request.id);

    // BACKEND: aquí envías el rechazo
  }
  // Modales
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

  // Validación y creación de tarea
  validateAddTask(): void {
    if (!this.taskForm.name.trim()) {
      this.snackBar.open('Por favor ingresa el nombre de la tarea', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validar email si se proporcionó
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

    // Crear tarea
    const newTaskId = Math.max(
      ...Object.values(this.project.tasks).flat().map(t => t.id),
      0
    ) + 1;

    const task: Task = {
      id: newTaskId,
      name: this.taskForm.name,
      assignee: this.taskForm.assignee || undefined
    };

    this.project.tasks.todo.push(task);

    this.snackBar.open('Tarea añadida exitosamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    // BACKEND LOGIC TO CREATE TASK

    this.closeTaskModal();
  }

  // Validación y actualización de tarea
  validateUpdateTask(): void {
    if (!this.taskForm.name.trim()) {
      this.snackBar.open('Por favor ingresa el nombre de la tarea', 'Cerrar', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    // Validar email si se proporcionó
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

    if (this.editingTask && this.editingTaskColumn) {
      // Actualizar la tarea
      this.editingTask.name = this.taskForm.name;
      this.editingTask.assignee = this.taskForm.assignee || undefined;

      this.snackBar.open('Tarea actualizada exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      // BACKEND LOGIC TO UPDATE TASK

      this.closeTaskModal();
    }
  }

  // Confirmación y eliminación de tarea
  confirmDeleteTask(): void {
    if (!this.editingTask || !this.editingTaskColumn) return;

    if (confirm(`¿Estás seguro de que quieres eliminar la tarea "${this.editingTask.name}"?`)) {
      const column = this.editingTaskColumn as keyof Project['tasks'];
      const index = this.project.tasks[column].indexOf(this.editingTask);
      
      if (index > -1) {
        this.project.tasks[column].splice(index, 1);
        
        this.snackBar.open('Tarea eliminada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // BACKEND LOGIC TO DELETE TASK
        
        this.closeTaskModal();
      }
    }
  }

  // Gestión de miembros
  removeMember(member: Member): void {
    if (member.isOwner) {
      this.snackBar.open('No puedes eliminar al propietario del proyecto', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar a ${member.name} del proyecto?`)) {
      const index = this.project.members.indexOf(member);
      if (index > -1) {
        this.project.members.splice(index, 1);
        
        this.snackBar.open('Integrante eliminado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // BACKEND LOGIC TO REMOVE MEMBER
      }
    }
  }

  // Validación y actualización del proyecto
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

  validateUpdate(): void {
    if (this.onSubmit()) {
      console.log('Actualizando proyecto:', this.project);

      // BACKEND UPDATE PROJECT LOGIC HERE
      // this.projectService.updateProject(this.project).subscribe({
      //   next: (response) => {
      //     this.snackBar.open('Proyecto actualizado exitosamente', 'Cerrar', {
      //       duration: 3000,
      //       panelClass: ['success-snackbar']
      //     });
      //   },
      //   error: (error) => {
      //     this.snackBar.open('Error al actualizar el proyecto', 'Cerrar', {
      //       duration: 3000,
      //       panelClass: ['error-snackbar']
      //     });
      //   }
      // });

      // Simulación de éxito
      this.snackBar.open('Proyecto actualizado exitosamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
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