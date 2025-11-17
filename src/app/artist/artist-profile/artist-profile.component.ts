import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

interface Artist {
  id: number;
  name: string;
  lastname: string;
  alias: string;
  email: string;
  bio: string;
  skills: string[];
}

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
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class ArtistProfileComponent implements OnInit {

  artist: Artist | null = null;
  artistProjects: Project[] = [];
  selectedProject: Project | null = null;

  artists: Artist[] = [
    {
      id: 1,
      name: 'María',
      lastname: 'González',
      alias: 'maria_design',
      email: 'maria.gonzalez@email.com',
      bio: 'Ilustradora digital con 5 años de experiencia en concept art y diseño de personajes. Especializada en estilo fantasy y sci-fi. He trabajado en proyectos indie y estudios de videojuegos, colaborando en el desarrollo visual de mundos y criaturas únicas.',
      skills: ['Ilustración', 'Concept Art', 'Diseño Gráfico', 'Tipografía']
    },
    {
      id: 2,
      name: 'Carlos',
      lastname: 'Rodríguez',
      alias: 'carlos_3d',
      email: 'carlos.rodriguez@email.com',
      bio: 'Artista 3D especializado en modelado orgánico y texturizado para videojuegos. Con experiencia en pipeline completo desde sculpting hasta baking y texturizado PBR. Apasionado por crear assets que cuenten historias.',
      skills: ['Modelado 3D', 'Diseño 3D', 'Animación 3D', 'Sculpting']
    },
    {
      id: 3,
      name: 'Ana',
      lastname: 'Martínez',
      alias: 'ana_animate',
      email: 'ana.martinez@email.com',
      bio: 'Animadora 2D con experiencia en motion graphics y series animadas. Especializada en character animation y storytelling visual. He trabajado en campañas publicitarias y contenido educativo animado.',
      skills: ['Animación 2D', 'Ilustración', 'Diseño Digital', 'Motion Graphics']
    },
    {
      id: 4,
      name: 'David',
      lastname: 'López',
      alias: 'david_photo',
      email: 'david.lopez@email.com',
      bio: 'Fotógrafo y editor profesional con enfoque en moda y retrato artístico. Más de 8 años de experiencia en producción fotográfica, iluminación y post-producción. Busco siempre capturar la esencia única de cada sujeto.',
      skills: ['Edición de Fotos', 'Diseño Gráfico', 'Tipografía', 'Fotografía']
    },
    {
      id: 5,
      name: 'Laura',
      lastname: 'Hernández',
      alias: 'laura_illust',
      email: 'laura.hernandez@email.com',
      bio: 'Ilustradora freelance especializada en libros infantiles y editorial. Mi trabajo se caracteriza por colores vibrantes y personajes expresivos. He ilustrado más de 15 libros publicados y colaborado con revistas internacionales.',
      skills: ['Ilustración', 'Tipografía', 'Concept Art', 'Diseño Editorial']
    },
    {
      id: 6,
      name: 'Javier',
      lastname: 'Sánchez',
      alias: 'javier_vfx',
      email: 'javier.sanchez@email.com',
      bio: 'Artista VFX y 3D generalista con experiencia en publicidad y cine. Dominio de software especializado para efectos visuales, composición e integración. Siempre buscando push creative boundaries.',
      skills: ['Animación 3D', 'Modelado 3D', 'Edición de Fotos', 'VFX', 'Compositing']
    }
  ];

  allProjects: Project[] = [
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const artistId = +params['id'];
      this.artist = this.artists.find(a => a.id === artistId) || null;
      
      if (this.artist) {
        this.loadArtistProjects(this.artist);
      } else {
        // Redirigir si no se encuentra el artista
        this.router.navigate(['/artists/dashboard']);
      }
    });
  }

  
  openProjectDetail(project: Project): void {
    this.selectedProject = project;
  }

  closeProjectDetail(): void {
    this.selectedProject = null;
  }


  loadArtistProjects(artist: Artist): void {
    // Filtrar proyectos que coincidan con las habilidades del artista
    this.artistProjects = this.allProjects.filter(project => 
      project.skills.some(skill => artist.skills.includes(skill))
    );
  }

  goBack(): void {
    this.location.back();
  }
}