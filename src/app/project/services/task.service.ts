// services/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CreateTaskRequest, 
  UpdateTaskRequest,
  DeleteTaskRequest 
} from '../models/requests/task.requests';
import { 
  TaskResponse,
  DeleteTaskResponse 
} from '../models/responses/task.responses';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  /**
   * Crear una nueva tarea
   * Endpoint: POST /task/create
   */
  createTask(request: CreateTaskRequest): Observable<TaskResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('📤 Creando tarea:', request);
    return this.http.post<TaskResponse>(`${this.apiUrl}/task/create`, request, { headers });
  }

  /**
   * Actualizar una tarea existente
   * Endpoint: PUT /task/update
   */
  updateTask(request: UpdateTaskRequest): Observable<TaskResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('📤 Actualizando tarea:', request);
    return this.http.put<TaskResponse>(`${this.apiUrl}/task/update`, request, { headers });
  }

  /**
   * Eliminar una tarea
   * Endpoint: DELETE /task/delete
   */
  deleteTask(taskId: number): Observable<DeleteTaskResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const request: DeleteTaskRequest = { taskId };
    
    console.log('📤 Eliminando tarea:', taskId);
    return this.http.request<DeleteTaskResponse>('delete', `${this.apiUrl}/task/delete`, {
      headers,
      body: request
    });
  }
}
