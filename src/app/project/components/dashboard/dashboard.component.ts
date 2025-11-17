import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../services/dashboard.service';
import { 
  ProjectFilterRequest, 
  ProjectJoinRequest, 
  ProjectBasicInfoRequest 
} from '../../models/requests/project.requests';
import { 
  ProjectBasic, 
  ProjectDetail 
} from '../../models/responses/project.responses';
import { FilterTasksPipe } from '../../pipes/filter-tasks.pipe'; 

interface SkillFilter {
  name: string;
  selected: boolean;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule, FilterTasksPipe],
})
export class DashboardComponent implements OnInit {

  searchQuery: string = '';
  selectedCategory: string = '';
  showSkillsDropdown: boolean = false;
  showCategoryDropdown: boolean = false;
  selectedProject: ProjectDetail | null = null;

  viewMode: 'public' | 'profile' | 'registered' = 'public';

  availableSkills: SkillFilter[] = [
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

  categories: string[] = [
    'Todos',
    'Ilustración',
    'Diseño Digital',
    'Branding',
    'Animación',
    'Arte 3D',
    'Edición y Fotografía'
  ];

  filteredProjects: ProjectBasic[] = [];

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.searchProjects();
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
    this.searchProjects();
  }

  searchProjects(): void {
    const selectedSkills = this.availableSkills
      .filter(skill => skill.selected)
      .map(skill => ({ name: skill.name }));

    const request: ProjectFilterRequest = {
      title: this.searchQuery || undefined,
      category: this.selectedCategory || undefined,
      type: this.viewMode,
      skills: selectedSkills,
      active: true
    };

    this.dashboardService.filterProjects(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.filteredProjects = response.data.projects;
        } else {
          this.snackBar.open(response.message, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error buscando proyectos:', error);
        this.snackBar.open('Error buscando proyectos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openProjectDetail(project: ProjectBasic): void {
    const request: ProjectBasicInfoRequest = {
      projectid: project.projectid
    };

    this.dashboardService.getProjectBasicInfo(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedProject = response.data;
        } else {
          this.snackBar.open(response.message, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error obteniendo información del proyecto:', error);
        this.snackBar.open('Error cargando información del proyecto', 'Cerrar', {
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
    if (this.selectedProject) {
      const request: ProjectJoinRequest = {
        projectid: this.selectedProject.projectid
      };

      this.dashboardService.joinProject(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open(response.message, 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.closeProjectDetail();
          } else {
            this.snackBar.open(response.message, 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error enviando solicitud:', error);
          this.snackBar.open('Error enviando solicitud', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  manageProject(projectId: number): void {
    this.router.navigate(['/project/manage', projectId]);
  }

  workProject(projectId: number): void {
    this.router.navigate(['/project/work', projectId]);
  }

  createProject(): void {
    this.router.navigate(['/create-project']);
  }
}