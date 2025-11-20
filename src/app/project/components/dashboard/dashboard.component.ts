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
    { name: 'Dibujo', id: 1, selected: false },
    { name: 'Pintura', id: 2, selected: false },
    { name: 'Animacion', id: 3, selected: false },
    { name: 'Escultura', id: 4, selected: false },
    { name: 'Grabado', id: 5, selected: false }
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
  ) { }

  filteredProjects: Project[] = [];

  currentUserId!: number;// TODO: Obtener del servicio de auth



  ngOnInit(): void {
    this.currentUserId = this.tokenService.getUserId()!;
    this.loadProjects();
  }

  loadProjects(): void {
    const selectedSkills = this.availableSkills
      .filter(s => s.selected)
      .map(s => ({ skillId: s.id, name: s.name }));
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
        this.filteredProjects = (response.data?.projects ?? []).map(p => ({
          id: p.projectId ?? 0,
          title: p.name ?? 'Sin título',
          description: p.description ?? 'Sin descripción',
          category: p.category ?? 'Sin categoría',
          skills: (p.skills ?? []).map((s: any) => s?.name ?? '')
        }));


      },
      error: (error) => {
        this.snackBar.open('Error al cargar los proyectos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  changeViewMode(mode: 'profile' | 'public' | 'registered'): void {
    this.viewMode = mode;
    this.loadProjects();
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
    if (this.showSkillsDropdown) {
      this.showCategoryDropdown = false;
    }
  }

  toggleCategoryDropdown(): void {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    if (this.showCategoryDropdown) {
      this.showSkillsDropdown = false;
    }
  }

  onSearch(): void {
    this.loadProjects();
  }

  onCategoryChange(): void {
    this.loadProjects();
    this.showCategoryDropdown = false;
  }

  onSkillsChange(): void {
    this.loadProjects();
  }

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
        this.snackBar.open('Error al cargar los detalles', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  closeProjectDetail(): void {
    this.selectedProject = null;
  }

  requestJoin(): void {
    if (!this.selectedProject) return;

    const request: ProjectJoinRequest = {
      projectId: this.selectedProject.id,
      userId: this.tokenService.getUserId()!
    };

    this.dashboardService.joinProject(request).subscribe({
      next: (response) => {
        if (response.code && response.code >= 200 && response.code < 300) {
          this.snackBar.open('Solicitud enviada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
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