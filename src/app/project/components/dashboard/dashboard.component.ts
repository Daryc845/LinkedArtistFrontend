import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { Project } from '../../models/dashboard-project.model';
import { 
  ProjectFilterRequest, 
  ProjectJoinRequest, 
  ProjectBasicInfoRequest 
} from '../../models/requests/dashboard.requests';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit {

  searchQuery: string = '';
  selectedCategory: string = 'Todos';
  showSkillsDropdown: boolean = false;
  showCategoryDropdown: boolean = false;
  selectedProject: Project | null = null;

  viewMode: 'profile' | 'public' | 'registered' = 'public';

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
    'Todos',
    'Ilustración',
    'Diseño Digital',
    'Branding',
    'Animación',
    'Arte 3D',
    'Edición y Fotografía'
  ];

  filteredProjects: Project[] = [];

  // ID del usuario actual (obtener de localstorage)
  currentUserId: number = 1; // TODO: Obtener del servicio de auth

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // Cargar proyectos inicialmente
    this.loadProjects();
  }

  /**
   * Cargar proyectos desde el backend según filtros actuales
   * Endpoint: POST /projects/filter
   */
  loadProjects(): void {
    const selectedSkills = this.availableSkills
      .filter(s => s.selected)
      .map(s => ({ name: s.name }));

    // Mapear el viewMode al tipo del backend
    const typeMap = {
      'public': 'public' as const,
      'profile': 'profile' as const,
      'registered': 'registered' as const
    };

    const request: ProjectFilterRequest = {
      title: this.searchQuery,
      category: this.selectedCategory === 'Todos' ? '' : this.selectedCategory,
      type: typeMap[this.viewMode],
      userid: this.currentUserId,
      skills: selectedSkills,
      active: true
    };

    this.dashboardService.filterProjects(request).subscribe({
      next: (response) => {
        if (response.success) {
          // Transformar la respuesta del backend al formato local
          this.filteredProjects = response.data.projects.map(p => ({
            id: p.projectid,
            title: p.title,
            description: p.description,
            category: p.category,
            skills: p.skills.map(s => s.name)
          }));
        }
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.snackBar.open('Error al cargar los proyectos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Manejar cambios en el modo de vista
   */
  changeViewMode(mode: 'profile' | 'public' | 'registered'): void {
    this.viewMode = mode;
    this.loadProjects();
  }

  /**
   * Toggle dropdown de habilidades
   */
  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
    if (this.showSkillsDropdown) {
      this.showCategoryDropdown = false;
    }
  }

  /**
   * Toggle dropdown de categorías
   */
  toggleCategoryDropdown(): void {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    if (this.showCategoryDropdown) {
      this.showSkillsDropdown = false;
    }
  }

  /**
   * Manejar búsqueda por texto
   * Se ejecuta cada vez que se presiona una tecla
   */
  onSearch(): void {
    this.loadProjects();
  }

  /**
   * Manejar cambio de categoría
   */
  onCategoryChange(): void {
    this.loadProjects();
    this.showCategoryDropdown = false;
  }

  /**
   * Manejar cambio de habilidades
   */
  onSkillsChange(): void {
    this.loadProjects();
  }

  /**
   * Abrir modal de detalle del proyecto
   * Endpoint: POST /projects/basic-info
   */
  openProjectDetail(project: Project): void {
    const request: ProjectBasicInfoRequest = {
      projectid: project.id
    };

    this.dashboardService.getProjectBasicInfo(request).subscribe({
      next: (response) => {
        if (response.success) {
          const tasks = {
            todo: [] as string[],
            inProgress: [] as string[],
            review: [] as string[],
            done: [] as string[]
          };

          response.data.tasks.forEach(task => {
            switch (task.state) {
              case 'to be done':
                tasks.todo.push(task.name);
                break;
              case 'in progress':
                tasks.inProgress.push(task.name);
                break;
              case 'under review':
                tasks.review.push(task.name);
                break;
              case 'done':
                tasks.done.push(task.name);
                break;
            }
          });

          // Actualizar proyecto seleccionado con información completa
          this.selectedProject = {
            id: project.id,
            title: response.data.title,
            description: response.data.description,
            category: response.data.category,
            skills: response.data.skills.map(s => s.name),
            tasks: tasks
          };
        }
      },
      error: (error) => {
        console.error('Error al cargar detalles del proyecto:', error);
        this.snackBar.open('Error al cargar los detalles', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Cerrar modal de detalle
   */
  closeProjectDetail(): void {
    this.selectedProject = null;
  }

  /**
   * Solicitar unirse al proyecto
   * Endpoint: POST /projects/join
   */
  requestJoin(): void {
    if (!this.selectedProject) return;

    const request: ProjectJoinRequest = {
      projectid: this.selectedProject.id
    };

    this.dashboardService.joinProject(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Solicitud enviada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        this.snackBar.open('Error al enviar la solicitud', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Navegar a la página de gestión del proyecto
   */
  manageProject(projectId: number): void {
    this.router.navigate(['/project/manage', projectId]);
  }

  /**
   * Navegar a la página de trabajo del proyecto
   */
  workProject(projectId: number): void {
    this.router.navigate(['/project/work', projectId]);
  }

  /**
   * Navegar a crear nuevo proyecto
   */
  createProject(): void {
    this.router.navigate(['/project/create']);
  }
}