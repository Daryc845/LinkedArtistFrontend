import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  ProjectFilterRequest, 
  ProjectJoinRequest, 
  ProjectBasicInfoRequest 
} from '../models/requests/project.requests';
import { 
  ProjectListResponse, 
  ProjectJoinResponse, 
  ProjectBasicInfoResponse,
  ProjectBasic,
  ProjectDetail
} from '../models/responses/project.responses';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Mock data para simular respuestas del backend
  private mockProjects: ProjectBasic[] = [
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
    }
  ];

  private mockProjectDetails: ProjectDetail[] = [
    {
      projectid: 1,
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
    }
  ];

  /**
   * Filtrar proyectos según habilidades, categoría y tipo de vista
   * Endpoint: POST /projects
   */
  filterProjects(request: ProjectFilterRequest): Observable<ProjectListResponse> {
    // TODO: Implementar llamada real al backend
    // return this.http.post<ProjectListResponse>('/api/projects', request);
    
    console.log('Enviando filtro al backend:', request);
    
    // Simulación de filtrado
    let filteredProjects = this.mockProjects;
    
    if (request.title) {
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(request.title!.toLowerCase())
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
    
    // Simular respuesta del backend
    return of({
      success: true,
      message: 'Proyectos filtrados exitosamente',
      data: {
        projects: filteredProjects
      }
    });
  }

  /**
   * Enviar solicitud para unirse a un proyecto
   * Endpoint: POST /projects/join
   */
  joinProject(request: ProjectJoinRequest): Observable<ProjectJoinResponse> {
    // TODO: Implementar llamada real al backend
    // return this.http.post<ProjectJoinResponse>('/api/projects/join', request);
    
    console.log('Enviando solicitud de unión:', request);
    
    // Simular respuesta del backend
    return of({
      success: true,
      message: 'Solicitud enviada correctamente'
    });
  }

  /**
   * Obtener información básica de un proyecto y sus tareas
   * Endpoint: POST /projects/basic-info
   */
  getProjectBasicInfo(request: ProjectBasicInfoRequest): Observable<ProjectBasicInfoResponse> {
    // TODO: Implementar llamada real al backend
    // return this.http.post<ProjectBasicInfoResponse>('/api/projects/basic-info', request);
    
    console.log('Solicitando información del proyecto:', request);
    
    const project = this.mockProjectDetails.find(p => p.projectid === request.projectid);
    
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
  }
}