// services/dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { 
  ProjectFilterRequest, 
  ProjectJoinRequest, 
  ProjectBasicInfoRequest 
} from '../models/requests/dashboard.requests';
import { 
  ProjectListResponse, 
  ProjectJoinResponse, 
  ProjectBasicInfoResponse,
  ProjectBasic,
  ProjectDetail
} from '../models/responses/dashboard.responses';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Filtrar proyectos según habilidades, categoría y tipo de vista
   * Endpoint: POST /projects/filter
   * Se usa cuando: se escribe en búsqueda, se cambia categoría, se cambian habilidades o se cambia vista
   */
  filterProjects(request: ProjectFilterRequest): Observable<ProjectListResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<ProjectListResponse>(`${this.apiUrl}/projects/filter`, request);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    console.log('📤 Request enviado al backend:', request);
    
    // Simular datos del backend
    const mockProjects: ProjectBasic[] = [
      {
        projectid: 1,
        title: 'Colección de Ilustraciones Experimentales',
        description: 'Buscamos ilustradores y diseñadores para crear una colección artística con estilos experimentales y técnicas mixtas.',
        category: 'Ilustración',
        skills: [{ name: 'Ilustración' }, { name: 'Concept Art' }, { name: 'Diseño Gráfico' }]
      },
      {
        projectid: 2,
        title: 'Branding para Marca de Moda Urbana',
        description: 'Se requiere diseñador gráfico para crear logotipo, paleta de colores y elementos visuales de una nueva marca urbana.',
        category: 'Branding',
        skills: [{ name: 'Diseño Gráfico' }, { name: 'Tipografía' }, { name: 'Edición de Fotos' }]
      },
      {
        projectid: 3,
        title: 'Modelos 3D para Proyecto de Realidad Aumentada',
        description: 'Se necesitan artistas 3D para modelar, texturizar y renderizar objetos estilizados para una app de AR.',
        category: 'Arte 3D',
        skills: [{ name: 'Modelado 3D' }, { name: 'Diseño 3D' }, { name: 'Ilustración' }]
      },
      {
        projectid: 4,
        title: 'Animación 2D para Video Promocional',
        description: 'Agencia busca animador para crear un video animado explicativo con estilo moderno y dinámico.',
        category: 'Animación',
        skills: [{ name: 'Animación 2D' }, { name: 'Ilustración' }, { name: 'Diseño Digital' }]
      },
      {
        projectid: 5,
        title: 'Edición y Retoque para Colección Fotográfica',
        description: 'Proyecto fotográfico busca un artista digital para retoque profesional, corrección de color y composición.',
        category: 'Edición y Fotografía',
        skills: [{ name: 'Edición de Fotos' }, { name: 'Diseño Gráfico' }, { name: 'Tipografía' }]
      },
      {
        projectid: 6,
        title: 'Animación 3D para Cortometraje Independiente',
        description: 'Buscamos artistas especializados en animación 3D para dar vida a personajes y escenas cinematográficas.',
        category: 'Arte 3D',
        skills: [{ name: 'Animación 3D' }, { name: 'Modelado 3D' }, { name: 'Ilustración' }]
      }
    ];

    // Simular filtrado local (el backend lo hará)
    let filteredProjects = mockProjects;
    
    if (request.title) {
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(request.title.toLowerCase()) ||
        project.description.toLowerCase().includes(request.title.toLowerCase())
      );
    }
    
    if (request.category && request.category !== 'Todos') {
      filteredProjects = filteredProjects.filter(project => 
        project.category === request.category
      );
    }
    
    if (request.skills.length > 0) {
      const selectedSkillNames = request.skills.map(skill => skill.name);
      filteredProjects = filteredProjects.filter(project => 
        project.skills.some(skill => selectedSkillNames.includes(skill.name))
      );
    }

    return of({
      success: true,
      message: 'Proyectos filtrados exitosamente',
      data: {
        projects: filteredProjects
      }
    });
    // ====== FIN DATOS QUEMADOS ======
  }

  /**
   * Enviar solicitud para unirse a un proyecto
   * Endpoint: POST /projects/join
   * Se usa cuando se presiona "Solicitar unirse" en el modal
   */
  joinProject(request: ProjectJoinRequest): Observable<ProjectJoinResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<ProjectJoinResponse>(`${this.apiUrl}/projects/join`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    console.log('📤 Solicitud de unión enviada:', request);
    
    return of({
      success: true,
      message: 'Solicitud enviada correctamente'
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Obtener información básica de un proyecto y sus tareas
   * Endpoint: POST /projects/basic-info
   * Se usa cuando se presiona sobre un proyecto para ver detalles
   */
  getProjectBasicInfo(request: ProjectBasicInfoRequest): Observable<ProjectBasicInfoResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<ProjectBasicInfoResponse>(`${this.apiUrl}/projects/basic-info`, request);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    console.log('📤 Solicitando información del proyecto:', request);
    
    const mockProjectDetails: { [key: number]: ProjectDetail } = {
      1: {
        title: 'Colección de Ilustraciones Experimentales',
        description: 'Buscamos ilustradores y diseñadores para crear una colección artística con estilos experimentales y técnicas mixtas.',
        category: 'Ilustración',
        skills: [{ name: 'Ilustración' }, { name: 'Concept Art' }, { name: 'Diseño Gráfico' }],
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
        skills: [{ name: 'Diseño Gráfico' }, { name: 'Tipografía' }, { name: 'Edición de Fotos' }],
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
        skills: [{ name: 'Modelado 3D' }, { name: 'Diseño 3D' }, { name: 'Ilustración' }],
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
        skills: [{ name: 'Animación 2D' }, { name: 'Ilustración' }, { name: 'Diseño Digital' }],
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
        skills: [{ name: 'Edición de Fotos' }, { name: 'Diseño Gráfico' }, { name: 'Tipografía' }],
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
        skills: [{ name: 'Animación 3D' }, { name: 'Modelado 3D' }, { name: 'Ilustración' }],
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
    
    const project = mockProjectDetails[request.projectid];
    
    if (project) {
      return of({
        success: true,
        message: 'Información del proyecto obtenida exitosamente',
        data: project
      });
    } else {
      return of({
        success: false,
        message: 'Proyecto no encontrado',
        data: {} as ProjectDetail
      });
    }
    // ====== FIN DATOS QUEMADOS ======
  }
}