// services/artist-profile.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { 
  GetArtistRequest, 
  GetProjectInfoRequest 
} from '../models/requests/artist-profile.requests';
import { 
  ArtistProfileResponse, 
  ProjectDetailResponse,
  ArtistData,
  ProjectDetailData
} from '../models/responses/artist-profile.responses';

@Injectable({
  providedIn: 'root'
})
export class ArtistProfileService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtener información completa del artista y sus proyectos
   * Endpoint: GET /user/{id}/all
   * Se usa cuando inicia la página, el ID se obtiene de la URL /artist/{id}
   */
  getArtistProfile(request: GetArtistRequest): Observable<ArtistProfileResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<ArtistProfileResponse>(`${this.apiUrl}/user/${request.userid}/all`);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    console.log('📤 Obteniendo perfil del artista:', request.userid);
    
    const mockArtists: { [key: number]: ArtistData } = {
      1: {
        userid: 1,
        name: 'María',
        lastname: 'González',
        nickname: 'maria_design',
        email: 'maria.gonzalez@email.com',
        biography: 'Ilustradora digital con 5 años de experiencia en concept art y diseño de personajes. Especializada en estilo fantasy y sci-fi. He trabajado en proyectos indie y estudios de videojuegos, colaborando en el desarrollo visual de mundos y criaturas únicas.',
        skills: [
          { name: 'Ilustración' },
          { name: 'Concept Art' },
          { name: 'Diseño Gráfico' },
          { name: 'Tipografía' }
        ],
        projects: [
          {
            projectid: 1,
            title: 'Colección de Ilustraciones Experimentales',
            description: 'Buscamos ilustradores y diseñadores para crear una colección artística con estilos experimentales y técnicas mixtas.',
            category: 'Ilustración',
            skills: [
              { name: 'Ilustración' },
              { name: 'Concept Art' },
              { name: 'Diseño Gráfico' }
            ]
          },
          {
            projectid: 4,
            title: 'Animación 2D para Video Promocional',
            description: 'Agencia busca animador para crear un video animado explicativo con estilo moderno y dinámico.',
            category: 'Animación',
            skills: [
              { name: 'Animación 2D' },
              { name: 'Ilustración' },
              { name: 'Diseño Digital' }
            ]
          }
        ]
      },
      2: {
        userid: 2,
        name: 'Carlos',
        lastname: 'Rodríguez',
        nickname: 'carlos_3d',
        email: 'carlos.rodriguez@email.com',
        biography: 'Artista 3D especializado en modelado orgánico y texturizado para videojuegos. Con experiencia en pipeline completo desde sculpting hasta baking y texturizado PBR. Apasionado por crear assets que cuenten historias.',
        skills: [
          { name: 'Modelado 3D' },
          { name: 'Diseño 3D' },
          { name: 'Animación 3D' },
          { name: 'Sculpting' }
        ],
        projects: [
          {
            projectid: 3,
            title: 'Modelos 3D para Proyecto de Realidad Aumentada',
            description: 'Se necesitan artistas 3D para modelar, texturizar y renderizar objetos estilizados para una app de AR.',
            category: 'Arte 3D',
            skills: [
              { name: 'Modelado 3D' },
              { name: 'Diseño 3D' },
              { name: 'Ilustración' }
            ]
          },
          {
            projectid: 6,
            title: 'Animación 3D para Cortometraje Independiente',
            description: 'Buscamos artistas especializados en animación 3D para dar vida a personajes y escenas cinematográficas.',
            category: 'Arte 3D',
            skills: [
              { name: 'Animación 3D' },
              { name: 'Modelado 3D' },
              { name: 'Ilustración' }
            ]
          }
        ]
      },
      3: {
        userid: 3,
        name: 'Ana',
        lastname: 'Martínez',
        nickname: 'ana_animate',
        email: 'ana.martinez@email.com',
        biography: 'Animadora 2D con experiencia en motion graphics y series animadas. Especializada en character animation y storytelling visual. He trabajado en campañas publicitarias y contenido educativo animado.',
        skills: [
          { name: 'Animación 2D' },
          { name: 'Ilustración' },
          { name: 'Diseño Digital' },
          { name: 'Motion Graphics' }
        ],
        projects: [
          {
            projectid: 4,
            title: 'Animación 2D para Video Promocional',
            description: 'Agencia busca animador para crear un video animado explicativo con estilo moderno y dinámico.',
            category: 'Animación',
            skills: [
              { name: 'Animación 2D' },
              { name: 'Ilustración' },
              { name: 'Diseño Digital' }
            ]
          }
        ]
      },
      4: {
        userid: 4,
        name: 'David',
        lastname: 'López',
        nickname: 'david_photo',
        email: 'david.lopez@email.com',
        biography: 'Fotógrafo y editor profesional con enfoque en moda y retrato artístico. Más de 8 años de experiencia en producción fotográfica, iluminación y post-producción. Busco siempre capturar la esencia única de cada sujeto.',
        skills: [
          { name: 'Edición de Fotos' },
          { name: 'Diseño Gráfico' },
          { name: 'Tipografía' },
          { name: 'Fotografía' }
        ],
        projects: [
          {
            projectid: 2,
            title: 'Branding para Marca de Moda Urbana',
            description: 'Se requiere diseñador gráfico para crear logotipo, paleta de colores y elementos visuales de una nueva marca urbana.',
            category: 'Branding',
            skills: [
              { name: 'Diseño Gráfico' },
              { name: 'Tipografía' },
              { name: 'Edición de Fotos' }
            ]
          },
          {
            projectid: 5,
            title: 'Edición y Retoque para Colección Fotográfica',
            description: 'Proyecto fotográfico busca un artista digital para retoque profesional, corrección de color y composición.',
            category: 'Edición y Fotografía',
            skills: [
              { name: 'Edición de Fotos' },
              { name: 'Diseño Gráfico' },
              { name: 'Tipografía' }
            ]
          }
        ]
      },
      5: {
        userid: 5,
        name: 'Laura',
        lastname: 'Hernández',
        nickname: 'laura_illust',
        email: 'laura.hernandez@email.com',
        biography: 'Ilustradora freelance especializada en libros infantiles y editorial. Mi trabajo se caracteriza por colores vibrantes y personajes expresivos. He ilustrado más de 15 libros publicados y colaborado con revistas internacionales.',
        skills: [
          { name: 'Ilustración' },
          { name: 'Tipografía' },
          { name: 'Concept Art' },
          { name: 'Diseño Editorial' }
        ],
        projects: [
          {
            projectid: 1,
            title: 'Colección de Ilustraciones Experimentales',
            description: 'Buscamos ilustradores y diseñadores para crear una colección artística con estilos experimentales y técnicas mixtas.',
            category: 'Ilustración',
            skills: [
              { name: 'Ilustración' },
              { name: 'Concept Art' },
              { name: 'Diseño Gráfico' }
            ]
          }
        ]
      },
      6: {
        userid: 6,
        name: 'Javier',
        lastname: 'Sánchez',
        nickname: 'javier_vfx',
        email: 'javier.sanchez@email.com',
        biography: 'Artista VFX y 3D generalista con experiencia en publicidad y cine. Dominio de software especializado para efectos visuales, composición e integración. Siempre buscando push creative boundaries.',
        skills: [
          { name: 'Animación 3D' },
          { name: 'Modelado 3D' },
          { name: 'Edición de Fotos' },
          { name: 'VFX' },
          { name: 'Compositing' }
        ],
        projects: [
          {
            projectid: 3,
            title: 'Modelos 3D para Proyecto de Realidad Aumentada',
            description: 'Se necesitan artistas 3D para modelar, texturizar y renderizar objetos estilizados para una app de AR.',
            category: 'Arte 3D',
            skills: [
              { name: 'Modelado 3D' },
              { name: 'Diseño 3D' },
              { name: 'Ilustración' }
            ]
          },
          {
            projectid: 6,
            title: 'Animación 3D para Cortometraje Independiente',
            description: 'Buscamos artistas especializados en animación 3D para dar vida a personajes y escenas cinematográficas.',
            category: 'Arte 3D',
            skills: [
              { name: 'Animación 3D' },
              { name: 'Modelado 3D' },
              { name: 'Ilustración' }
            ]
          }
        ]
      }
    };

    const artistData = mockArtists[request.userid];

    if (artistData) {
      return of({
        success: true,
        message: 'Perfil del artista obtenido exitosamente',
        data: artistData
      });
    } else {
      return of({
        success: false,
        message: 'Artista no encontrado',
        data: {} as ArtistData
      });
    }
    // ====== FIN DATOS QUEMADOS ======
  }

  /**
   * Obtener información detallada de un proyecto con sus tareas
   * Endpoint: GET /projects/{id}/bgetinfo
   * Se usa cuando se presiona sobre un proyecto del artista
   */
  getProjectDetail(request: GetProjectInfoRequest): Observable<ProjectDetailResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<ProjectDetailResponse>(`${this.apiUrl}/projects/${request.projectid}/bgetinfo`);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    console.log('📤 Obteniendo detalles del proyecto:', request.projectid);
    
    const mockProjectDetails: { [key: number]: ProjectDetailData } = {
      1: {
        title: 'Colección de Ilustraciones Experimentales',
        description: 'Buscamos ilustradores y diseñadores para crear una colección artística con estilos experimentales y técnicas mixtas.',
        category: 'Ilustración',
        skills: [
          { name: 'Ilustración' },
          { name: 'Concept Art' },
          { name: 'Diseño Gráfico' }
        ],
        tasks: [
          { name: 'Definir estilo visual', state: 'to be done' },
          { name: 'Crear moodboard', state: 'to be done' },
          { name: 'Bocetos iniciales', state: 'in progress' },
          { name: 'Revisión de composición y paleta', state: 'under review' },
          { name: 'Reunión inicial', state: 'done' },
          { name: 'Referencias recopiladas', state: 'done' }
        ]
      },
      2: {
        title: 'Branding para Marca de Moda Urbana',
        description: 'Se requiere diseñador gráfico para crear logotipo, paleta de colores y elementos visuales de una nueva marca urbana.',
        category: 'Branding',
        skills: [
          { name: 'Diseño Gráfico' },
          { name: 'Tipografía' },
          { name: 'Edición de Fotos' }
        ],
        tasks: [
          { name: 'Diseñar propuestas de logo', state: 'to be done' },
          { name: 'Definir paleta cromática', state: 'to be done' },
          { name: 'Exploración tipográfica', state: 'in progress' },
          { name: 'Estudio del target', state: 'done' },
          { name: 'Análisis de competencia', state: 'done' }
        ]
      },
      3: {
        title: 'Modelos 3D para Proyecto de Realidad Aumentada',
        description: 'Se necesitan artistas 3D para modelar, texturizar y renderizar objetos estilizados para una app de AR.',
        category: 'Arte 3D',
        skills: [
          { name: 'Modelado 3D' },
          { name: 'Diseño 3D' },
          { name: 'Ilustración' }
        ],
        tasks: [
          { name: 'Crear texturas PBR', state: 'to be done' },
          { name: 'Configurar materiales', state: 'to be done' },
          { name: 'Modelado de personaje 4', state: 'in progress' },
          { name: 'Modelado de objeto 5', state: 'in progress' },
          { name: 'Revisión de UVs del modelo 3', state: 'under review' },
          { name: 'Modelos base completados', state: 'done' },
          { name: 'Retopología lista', state: 'done' }
        ]
      },
      4: {
        title: 'Animación 2D para Video Promocional',
        description: 'Agencia busca animador para crear un video animado explicativo con estilo moderno y dinámico.',
        category: 'Animación',
        skills: [
          { name: 'Animación 2D' },
          { name: 'Ilustración' },
          { name: 'Diseño Digital' }
        ],
        tasks: [
          { name: 'Animar escena 3', state: 'to be done' },
          { name: 'Animar escena 4', state: 'to be done' },
          { name: 'Animación del personaje principal', state: 'in progress' },
          { name: 'Storyboards y timing', state: 'under review' },
          { name: 'Guion gráfico', state: 'done' },
          { name: 'Diseño de personajes', state: 'done' }
        ]
      },
      5: {
        title: 'Edición y Retoque para Colección Fotográfica',
        description: 'Proyecto fotográfico busca un artista digital para retoque profesional, corrección de color y composición.',
        category: 'Edición y Fotografía',
        skills: [
          { name: 'Edición de Fotos' },
          { name: 'Diseño Gráfico' },
          { name: 'Tipografía' }
        ],
        tasks: [
          { name: 'Corrección avanzada de color', state: 'to be done' },
          { name: 'Edición de fondos', state: 'to be done' },
          { name: 'Retoque de piel en lote 1', state: 'in progress' },
          { name: 'Selección de fotografías', state: 'done' },
          { name: 'Ajustes principales', state: 'done' }
        ]
      },
      6: {
        title: 'Animación 3D para Cortometraje Independiente',
        description: 'Buscamos artistas especializados en animación 3D para dar vida a personajes y escenas cinematográficas.',
        category: 'Arte 3D',
        skills: [
          { name: 'Animación 3D' },
          { name: 'Modelado 3D' },
          { name: 'Ilustración' }
        ],
        tasks: [
          { name: 'Animar escena 4', state: 'to be done' },
          { name: 'Render final', state: 'to be done' },
          { name: 'Animación de escena 3', state: 'in progress' },
          { name: 'Ajustes de iluminación en escena 2', state: 'under review' },
          { name: 'Animación de escena 1', state: 'done' },
          { name: 'Bloqueo inicial', state: 'done' }
        ]
      }
    };

    const projectData = mockProjectDetails[request.projectid];

    if (projectData) {
      return of({
        success: true,
        message: 'Información del proyecto obtenida exitosamente',
        data: projectData
      });
    } else {
      return of({
        success: false,
        message: 'Proyecto no encontrado',
        data: {} as ProjectDetailData
      });
    }
    // ====== FIN DATOS QUEMADOS ======
  }
}