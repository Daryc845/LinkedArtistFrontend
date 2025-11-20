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
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.prodUrl;

  constructor(private http: HttpClient) { }

  createTask(request: CreateTaskRequest): Observable<TaskResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<TaskResponse>(`${this.apiUrl}/task/create`, request, { headers });
  }

  updateTask(request: UpdateTaskRequest): Observable<TaskResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('📤 Actualizando tarea:', request);
    return this.http.put<TaskResponse>(`${this.apiUrl}/task/update`, request, { headers });
  }

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
