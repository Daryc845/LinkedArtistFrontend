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
import { TokenService } from '../../../services/token.service';

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
    { name: 'Dibujo', id: 1 , selected: false},
    { name: 'Animacion', id: 2 , selected: false},
    { name: 'Escultura', id: 3 , selected: false},
    { name: 'Grabado', id: 4 , selected: false}
  ];

  categories = [
    'Stop Motion',
    'Anime',
    'Comic',
    'Oleo',
    'Pixel Art'
  ];

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private tokenService: TokenService
  ) {}

  filteredProjects: Project[] = [];

  // ID del usuario actual (obtener de localstorage)
  currentUserId!: number;// TODO: Obtener del servicio de auth

  

  ngOnInit(): void {
    this.currentUserId = this.tokenService.getUserId()!; 
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
      .map(s => ({ skillId: s.id, name: s.name }));
    console.log('🎯 Skills seleccionados con IDs:', selectedSkills);
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
      userId: this.currentUserId,
      skills: selectedSkills,
      active: true
    };

    this.dashboardService.filterProjects(request).subscribe({
      next: (response) => {
        console.log('📥 Respuesta recibida del backend:', response);
        this.filteredProjects = (response.data?.projects ?? []).map(p => ({
          id: p.projectId ?? 0,
          title: p.name ?? 'Sin título',
          description: p.description ?? 'Sin descripción',
          category: p.category ?? 'Sin categoría',
          skills: (p.skills ?? []).map((s: any) => s?.name ?? '')
        }));

      
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
    

    this.dashboardService.getProjectBasicInfo(project.id).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          const tasks = {
            todo: [] as any[],
            inProgress: [] as any[],
            review: [] as any[],
            done: [] as any[]
          };
          console.log('📥 Detalles del proyecto recibidos:', response);
          response.data.tasks.forEach(task => {
            const taskInfo = {
              name: task.name,
              userEmail: task.userEmail,
              userName: task.userName,
              userLastname: task.userLastname
            };
            
            switch (task.state) {
              case 'to be done':
                tasks.todo.push(taskInfo);
                break;
              case 'in progress':
                tasks.inProgress.push(taskInfo);
                break;
              case 'under review':
                tasks.review.push(taskInfo);
                break;
              case 'done':
                tasks.done.push(taskInfo);
                break;
            }
          });

          // Actualizar proyecto seleccionado con información completa
          this.selectedProject = {
            id: project.id,
            title: response.data.name,
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
      projectId: this.selectedProject.id,
      userId: this.tokenService.getUserId()!
    };

    this.dashboardService.joinProject(request).subscribe({
      next: (response) => {
        console.log('📥 Respuesta de solicitud de unión:', response);
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open('Solicitud enviada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }else{
          this.snackBar.open('La solicitud ya fue enviada', 'Cerrar', {
            duration: 3000,
            panelClass: ['warning-snackbar']
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