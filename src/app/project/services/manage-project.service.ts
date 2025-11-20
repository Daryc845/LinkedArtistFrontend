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
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageProjectService {
  private apiUrl = environment.prodUrl;

  constructor(private http: HttpClient) { }

  getProject(id: number): Observable<ProjectResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ProjectResponse>(`${this.apiUrl}/projects/${id}`, { headers } );
  }

  updateProject(request: UpdateProjectRequest): Observable<BaseResponse> {
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

  getMembers(projectId: number): Observable<MembersResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<MembersResponse>(`${this.apiUrl}/projects/${projectId}/members`, { headers });
  }

  removeMember(request: RemoveMemberRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<BaseResponse>(`${this.apiUrl}/projects/member`, {body: request, headers });
    
  }

  getRequests(projectId: number): Observable<RequestsResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<RequestsResponse>(`${this.apiUrl}/projects/${projectId}/requests`, { headers });
  }
  
  acceptRequest(request: AcceptRequestRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(`${this.apiUrl}/projects/requests/accept`, request, { headers });
  }

  rejectRequest(request: RejectRequestRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<BaseResponse>(`${this.apiUrl}/projects/requests/decline`, request, { headers });
  }
}