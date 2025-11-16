import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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
}

@Component({
  standalone: true,
  selector: 'app-work-project',
  templateUrl: './work-project.component.html',
  styleUrls: ['../project-styles.css', './work-project.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class WorkProjectComponent implements OnInit {

  showMembersListModal: boolean = false;

  draggedTask: Task | null = null;
  draggedFromColumn: string = '';

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

  // Drag and Drop
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

  // Modal de integrantes
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