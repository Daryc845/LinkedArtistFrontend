import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateTaskStateRequest } from '../models/requests/work-project.requests';
import { ProjectResponse, MembersResponse, BaseResponse } from '../models/responses/work-project.responses';

@Injectable({
  providedIn: 'root'
})
export class WorkProjectService {
  private apiUrl = 'https://partyst-api-gateway.onrender.com';

  constructor(private http: HttpClient) { }

  getProject(id: number): Observable<ProjectResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<ProjectResponse>(`${this.apiUrl}/projects/${id}`);
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
                  userId: 2,
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
                  userId: 3,
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
                  userId: 4,
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
  }

  updateTaskState(request: UpdateTaskStateRequest): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.put<BaseResponse>(`${this.apiUrl}/projects/tasks/state`, request);
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Task state updated successfully' });
        observer.complete();
      }, 500);
    });
  }

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
                userId: 1,
                name: 'Juan',
                lastname: 'Pérez',
                nickname: 'JuanArt',
                email: 'juan@email.com',
                isOwner: true
              },
              {
                userId: 2,
                name: 'María',
                lastname: 'López',
                nickname: 'MaríaDesign',
                email: 'maria@email.com',
                isOwner: false
              },
              {
                userId: 3,
                name: 'Carlos',
                lastname: 'Ruiz',
                email: 'carlos@email.com',
                isOwner: false
              },
              {
                userId: 4,
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
  }
}