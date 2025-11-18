// services/manage-project.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  UpdateProjectRequest, 
  CreateTaskRequest, 
  UpdateTaskStateRequest, 
  UpdateTaskRequest, 
  RemoveMemberRequest, 
  AcceptRequestRequest, 
  RejectRequestRequest 
} from '../models/requests/manage-project.requests';
import { 
  BaseResponse, 
  ProjectResponse, 
  MembersResponse, 
  RequestsResponse,
} from '../models/responses/manage-project.responses';

@Injectable({
  providedIn: 'root'
})
export class ManageProjectService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtener información del proyecto
   * Endpoint: GET /projects/{id}
   * Se usa cuando se carga la página según el id de la URL /project/manage/{id}
   */
  getProject(id: number): Observable<ProjectResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<ProjectResponse>(`${this.apiUrl}/projects/${id}`);
    
    // ====== PROYECTO QUEMADO - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Project loaded successfully',
          data: {
            title: 'Colección de Ilustraciones Experimentales',
            description: 'Proyecto artístico que busca crear una colección de ilustraciones con técnicas experimentales.',
            category: 'Ilustración',
            skills: [
              { name: 'Ilustración' },
              { name: 'Concept Art' },
              { name: 'Diseño Gráfico' }
            ],
            tasks: [
              {
                name: 'Definir estilo visual',
                state: 'to be done',
                user: {
                  userid: 2,
                  name: 'María',
                  lastname: 'López',
                  nickname: 'MaríaDesign',
                  email: 'maria@email.com'
                }
              },
              {
                name: 'Crear moodboard',
                state: 'to be done'
              },
              {
                name: 'Bocetos iniciales',
                state: 'in progress',
                user: {
                  userid: 3,
                  name: 'Carlos',
                  lastname: 'Ruiz',
                  email: 'carlos@email.com'
                }
              },
              {
                name: 'Revisión de composición',
                state: 'under review'
              },
              {
                name: 'Reunión inicial',
                state: 'done',
                user: {
                  userid: 4,
                  name: 'Ana',
                  lastname: 'García',
                  nickname: 'AnaIllustrator',
                  email: 'ana@email.com'
                }
              },
              {
                name: 'Referencias recopiladas',
                state: 'done'
              }
            ]
          }
        });
        observer.complete();
      }, 500);
    });
    // ====== FIN PROYECTO QUEMADO ======
  }

  /**
   * Actualizar información del proyecto
   * Endpoint: PUT /projects/update
   * Se usa cuando se presiona "Guardar cambios" en el panel principal
   */
  updateProject(request: UpdateProjectRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.put<BaseResponse>(`${this.apiUrl}/projects/update`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Project updated successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Eliminar proyecto
   * Endpoint: DELETE /projects/{id}/delete
   * Se usa cuando se presiona "Eliminar proyecto"
   */
  deleteProject(id: number): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.delete<BaseResponse>(`${this.apiUrl}/projects/${id}/delete`);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Project deleted successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Crear nueva tarea
   * Endpoint: POST /projects/tasks/create
   * Se usa cuando se presiona "Añadir tarea"
   */
  createTask(request: CreateTaskRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<BaseResponse>(`${this.apiUrl}/projects/tasks/create`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Task created successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Actualizar estado de tarea (drag & drop)
   * Endpoint: PUT /projects/tasks/state
   * Se usa cuando se arrastra una tarea de un estado a otro
   */
  updateTaskState(request: UpdateTaskStateRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.put<BaseResponse>(`${this.apiUrl}/projects/tasks/state`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Task state updated successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Actualizar tarea completa
   * Endpoint: PUT /projects/tasks/update
   * Se usa cuando se presiona "Guardar cambios" en el modal de editar tarea
   */
  updateTask(request: UpdateTaskRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.put<BaseResponse>(`${this.apiUrl}/projects/tasks/update`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Task updated successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Obtener miembros del proyecto
   * Endpoint: GET /projects/{id}/members
   * Se usa cuando se presiona "Ver integrantes"
   */
  getMembers(projectId: number): Observable<MembersResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<MembersResponse>(`${this.apiUrl}/projects/${projectId}/members`);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Members loaded successfully',
          data: {
            members: [
              {
                userid: 1,
                name: 'Juan',
                lastname: 'Pérez',
                nickname: 'JuanArt',
                email: 'juan@email.com',
                isOwner: true
              },
              {
                userid: 2,
                name: 'María',
                lastname: 'López',
                nickname: 'MaríaDesign',
                email: 'maria@email.com',
                isOwner: false
              },
              {
                userid: 3,
                name: 'Carlos',
                lastname: 'Ruiz',
                email: 'carlos@email.com',
                isOwner: false
              },
              {
                userid: 4,
                name: 'Ana',
                lastname: 'García',
                nickname: 'AnaIllustrator',
                email: 'ana@email.com',
                isOwner: false
              }
            ]
          }
        });
        observer.complete();
      }, 500);
    });
    // ====== FIN DATOS QUEMADOS ======
  }

  /**
   * Eliminar miembro del proyecto
   * Endpoint: DELETE /projects/member
   * Se usa cuando se presiona eliminar miembro en el panel de integrantes
   */
  removeMember(request: RemoveMemberRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.delete<BaseResponse>(`${this.apiUrl}/projects/member`, { body: request });
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Member removed successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Obtener solicitudes del proyecto
   * Endpoint: GET /projects/{id}/requests
   * Se usa cuando se presiona "Abrir centro de solicitudes"
   */
  getRequests(projectId: number): Observable<RequestsResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<RequestsResponse>(`${this.apiUrl}/projects/${projectId}/requests`);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Requests loaded successfully',
          body: {
            requests: [
              {
                userid: 5,
                name: 'Laura',
                lastname: 'Hernández',
                nickname: 'LauraArts',
                email: 'laura@email.com'
              },
              {
                userid: 6,
                name: 'Pedro',
                lastname: 'Gómez',
                email: 'pedro@email.com'
              }
            ]
          }
        });
        observer.complete();
      }, 500);
    });
    // ====== FIN DATOS QUEMADOS ======
  }

  /**
   * Aceptar solicitud
   * Endpoint: POST /projects/requests/accept
   * Se usa cuando se presiona "Aceptar" en el centro de solicitudes
   */
  acceptRequest(request: AcceptRequestRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<BaseResponse>(`${this.apiUrl}/projects/requests/accept`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Request accepted successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Rechazar solicitud
   * Endpoint: POST /projects/requests/decline
   * Se usa cuando se presiona "Rechazar" en el centro de solicitudes
   */
  rejectRequest(request: RejectRequestRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<BaseResponse>(`${this.apiUrl}/projects/requests/decline`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Request rejected successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }
}