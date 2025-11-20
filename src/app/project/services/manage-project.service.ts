// services/manage-project.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  UpdateProjectRequest, 
  UpdateTaskStateRequest, 
  DeleteTaskRequest, 
  RemoveMemberRequest, 
  AcceptRequestRequest, 
  RejectRequestRequest 
} from '../models/requests/manage-project.requests';
import { UpdateTaskRequest } from '../models/requests/task.requests';
import { 
  BaseResponse, 
  ProjectResponse, 
  MembersResponse, 
  RequestsResponse,
} from '../models/responses/manage-project.responses';
import { CreateTaskRequest } from '../models/requests/task.requests';

@Injectable({
  providedIn: 'root'
})
export class ManageProjectService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  /**
   * Obtener información del proyecto
   * Endpoint: GET /projects/{id}
   * Se usa cuando se carga la página según el id de la URL /project/manage/{id}
   */
  getProject(id: number): Observable<ProjectResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ProjectResponse>(`${this.apiUrl}/projects/${id}`, { headers } );
  }

  /**
   * Actualizar información del proyecto
   * Endpoint: PUT /projects/update
   * Se usa cuando se presiona "Guardar cambios" en el panel principal
   */
  updateProject(request: UpdateProjectRequest): Observable<BaseResponse> {
    console.log('📤 Enviando solicitud de actualización de proyecto:', request);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(`${this.apiUrl}/projects/update`, request, { headers } );
    
  }

  deleteProject(id: number): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<BaseResponse>(`${this.apiUrl}/projects/${id}/delete`, { headers });
  }

  createTask(request: CreateTaskRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(`${this.apiUrl}/task/create`, request, { headers });
    
  }

  updateTaskState(request: UpdateTaskStateRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<BaseResponse>(`${this.apiUrl}/task/state`, request, { headers });
  }

  updateTask(request: UpdateTaskRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<BaseResponse>(`${this.apiUrl}/task/update`, request, {headers});
  }

  deleteTask(request: DeleteTaskRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<BaseResponse>(`${this.apiUrl}/task/delete`, { 
      headers,
      body: request 
    });
  }

  /**
   * Solicitar unirse a un proyecto
   * Endpoint: POST /projects/join
   * Se usa cuando un usuario quiere unirse a un proyecto
   */
  joinProject(projectId: number, userId: number, message?: string): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(
      `${this.apiUrl}/projects/join`, 
      { projectId, userId, message },
      { headers }
    );
  }

  /**
   * Obtener miembros del proyecto
   * Endpoint: GET /projects/{id}/members
   * Se usa cuando se presiona "Ver integrantes"
   */
  getMembers(projectId: number): Observable<MembersResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<MembersResponse>(`${this.apiUrl}/projects/${projectId}/members`, { headers });
  }

  /**
   * Eliminar miembro del proyecto
   * Endpoint: DELETE /projects/member
   * Se usa cuando se presiona eliminar miembro en el panel de integrantes
   */
  removeMember(request: RemoveMemberRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    return this.http.delete<BaseResponse>(`${this.apiUrl}/projects/member`, { body: request });
    
  }

  /**
   * Obtener solicitudes del proyecto
   * Endpoint: GET /projects/{id}/requests
   * Se usa cuando se presiona "Abrir centro de solicitudes"
   */
  getRequests(projectId: number): Observable<RequestsResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<RequestsResponse>(`${this.apiUrl}/projects/${projectId}/requests`, { headers });
  }

  /**
   * Aceptar solicitud
   * Endpoint: POST /projects/requests/accept
   * Se usa cuando se presiona "Aceptar" en el centro de solicitudes
   */
  acceptRequest(request: AcceptRequestRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(`${this.apiUrl}/projects/requests/accept`, request, { headers });
  }

  /**
   * Rechazar solicitud
   * Endpoint: POST /projects/requests/decline
   * Se usa cuando se presiona "Rechazar" en el centro de solicitudes
   */
  rejectRequest(request: RejectRequestRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(`${this.apiUrl}/projects/requests/decline`, request, { headers });
  }
}