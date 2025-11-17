import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks?: {
    todo: string[];
    inProgress: string[];
    review: string[];
    done: string[];
  };
}

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
  selectedCategory: string = '';
  showSkillsDropdown: boolean = false;
  showCategoryDropdown: boolean = false;
  selectedProject: Project | null = null;

  viewMode: 'me' | 'public' | 'subscribed' = 'me';

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


  projects: Project[] = [
  {
    id: 1,
    title: 'Colección de Ilustraciones Experimentales',
    description: 'Buscamos ilustradores y diseñadores para crear una colección artística con estilos experimentales y técnicas mixtas.',
    category: 'Ilustración',
    skills: ['Ilustración', 'Concept Art', 'Diseño Gráfico'],
    tasks: {
      todo: ['Definir estilo visual', 'Crear moodboard'],
      inProgress: ['Bocetos iniciales'],
      review: ['Revisión de composición y paleta'],
      done: ['Reunión inicial', 'Referencias recopiladas']
    }
  },
  {
    id: 2,
    title: 'Branding para Marca de Moda Urbana',
    description: 'Se requiere diseñador gráfico para crear logotipo, paleta de colores y elementos visuales de una nueva marca urbana.',
    category: 'Branding',
    skills: ['Diseño Gráfico', 'Tipografía', 'Edición de Fotos'],
    tasks: {
      todo: ['Diseñar propuestas de logo', 'Definir paleta cromática'],
      inProgress: ['Exploración tipográfica'],
      review: [],
      done: ['Estudio del target', 'Análisis de competencia']
    }
  },
  {
    id: 3,
    title: 'Modelos 3D para Proyecto de Realidad Aumentada',
    description: 'Se necesitan artistas 3D para modelar, texturizar y renderizar objetos estilizados para una app de AR.',
    category: 'Arte 3D',
    skills: ['Modelado 3D', 'Diseño 3D', 'Ilustración'],
    tasks: {
      todo: ['Crear texturas PBR', 'Configurar materiales'],
      inProgress: ['Modelado de personaje 4', 'Modelado de objeto 5'],
      review: ['Revisión de UVs del modelo 3'],
      done: ['Modelos base completados', 'Retopología lista']
    }
  },
  {
    id: 4,
    title: 'Animación 2D para Video Promocional',
    description: 'Agencia busca animador para crear un video animado explicativo con estilo moderno y dinámico.',
    category: 'Animación',
    skills: ['Animación 2D', 'Ilustración', 'Diseño Digital'],
    tasks: {
      todo: ['Animar escena 3', 'Animar escena 4'],
      inProgress: ['Animación del personaje principal'],
      review: ['Storyboards y timing'],
      done: ['Guion gráfico', 'Diseño de personajes']
    }
  },
  {
    id: 5,
    title: 'Edición y Retoque para Colección Fotográfica',
    description: 'Proyecto fotográfico busca un artista digital para retoque profesional, corrección de color y composición.',
    category: 'Edición y Fotografía',
    skills: ['Edición de Fotos', 'Diseño Gráfico', 'Tipografía'],
    tasks: {
      todo: ['Corrección avanzada de color', 'Edición de fondos'],
      inProgress: ['Retoque de piel en lote 1'],
      review: [],
      done: ['Selección de fotografías', 'Ajustes principales']
    }
  },
  {
    id: 6,
    title: 'Animación 3D para Cortometraje Independiente',
    description: 'Buscamos artistas especializados en animación 3D para dar vida a personajes y escenas cinematográficas.',
    category: 'Arte 3D',
    skills: ['Animación 3D', 'Modelado 3D', 'Ilustración'],
    tasks: {
      todo: ['Animar escena 4', 'Render final'],
      inProgress: ['Animación de escena 3'],
      review: ['Ajustes de iluminación en escena 2'],
      done: ['Animación de escena 1', 'Bloqueo inicial']
    }
  }
];


  filteredProjects: Project[] = [];

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.filteredProjects = [...this.projects];
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
    this.filterProjects();
  }

  filterProjects(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const selectedSkills = this.availableSkills
        .filter(s => s.selected)
        .map(s => s.name);
      
      const matchesSkills = selectedSkills.length === 0 || 
                           selectedSkills.some(skill => project.skills.includes(skill));
      
      const matchesCategory = !this.selectedCategory || 
                             this.selectedCategory === 'Todos' || 
                             project.category === this.selectedCategory;

      return matchesSearch && matchesSkills && matchesCategory;
    });
  }

  openProjectDetail(project: Project): void {
    this.selectedProject = project;
  }

  closeProjectDetail(): void {
    this.selectedProject = null;
  }

  requestJoin(): void {
    console.log('Solicitando unirse al proyecto:', this.selectedProject?.title);
    // BACKEND LOGIC HERE
    this.snackBar.open('Solicitud enviada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
    });
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

  logout(): void {
    // BACKEND LOGOUT LOGIC HERE
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
        duration: 10000,
        panelClass: ['success-snackbar']
    });
    this.router.navigate(['../../auth/login']);
  }
}