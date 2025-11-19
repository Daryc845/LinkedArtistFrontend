// services/dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  /**
   * Filtrar proyectos según habilidades, categoría y tipo de vista
   * Endpoint: POST /projects/filter
   * Se usa cuando: se escribe en búsqueda, se cambia categoría, se cambian habilidades o se cambia vista
   */
  filterProjects(request: ProjectFilterRequest): Observable<ProjectListResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // BACKEND: Descomentar cuando esté listo el backend
     return this.http.post<ProjectListResponse>(`${this.apiUrl}/projects/filter`, request, { headers });
  }

  /**
   * Enviar solicitud para unirse a un proyecto
   * Endpoint: POST /projects/join
   * Se usa cuando se presiona "Solicitar unirse" en el modal
   */
  joinProject(request: ProjectJoinRequest): Observable<ProjectJoinResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    return this.http.post<ProjectJoinResponse>(`${this.apiUrl}/projects/join`, request);
    
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
  getProjectBasicInfo(projectId: number): Observable<ProjectBasicInfoResponse> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ProjectBasicInfoResponse>(
      `${this.apiUrl}/projects/${projectId}`,
      { headers }
    );
  }
}