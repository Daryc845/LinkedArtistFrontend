import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserRequest } from '../models/requests/dashboard.requests';
import { UserResponse, UpdateUserResponse, BaseResponse } from '../models/responses/dashboard.responses';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  /**
   * Obtener información del usuario actual
   * Endpoint: GET /user/{id}
   * Se usa cuando se carga la página
   */
  getUser(id: number): Observable<UserResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<UserResponse>(`${this.apiUrl}/user/${id}`);
    
    // ====== USUARIO QUEMADO - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'User loaded successfully',
          data: {
            name: 'Juan Ernesto',
            lastname: 'Pérez Hernandez',
            nickname: 'DJ Shadow',
            cellphone: '+57 300 123 4567',
            email: 'juan@email.com',
            password: 'hashedpassword123',
            skills: [
              { name: 'Animación 2D' },
              { name: 'Animación 3D' },
              { name: 'Modelado 3D' }
            ],
            biography: 'Productor musical con 10 años de experiencia en géneros electrónicos y urbanos. He trabajado con diversos artistas independientes y siempre busco nuevos proyectos creativos.'
          }
        });
        observer.complete();
      }, 500);
    });
    // ====== FIN USUARIO QUEMADO ======
  }

  /**
   * Actualizar perfil del usuario
   * Endpoint: PUT /user/update
   * Se usa cuando se presiona "Guardar cambios"
   */
  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.put<UpdateUserResponse>(`${this.apiUrl}/user/update`, request);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ 
          success: true, 
          message: 'User updated successfully',
          body: {
            token: 'new-jwt-token-here'
          }
        });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Eliminar cuenta de usuario
   * Endpoint: DELETE /user/{id}/delete
   * Se usa cuando se presiona "Eliminar cuenta"
   */
  deleteUser(id: number): Observable<BaseResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.delete<BaseResponse>(`${this.apiUrl}/user/${id}/delete`);
    
    // ====== RESPUESTA SIMULADA - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'User deleted successfully' });
        observer.complete();
      }, 500);
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }
}