// services/work-project.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateTaskStateRequest } from '../models/requests/manage-project.requests';
import { 
  ProjectResponse, 
  MembersResponse, 
  BaseResponse 
} from '../models/responses/manage-project.responses';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkProjectService {
  private apiUrl = environment.prodUrl;

  constructor(private http: HttpClient) { }

  getProject(id: number): Observable<ProjectResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ProjectResponse>(`${this.apiUrl}/projects/${id}`, { headers });
  }

  updateTaskState(request: UpdateTaskStateRequest): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<BaseResponse>(`${this.apiUrl}/task/state`, request, { headers });
  }

  getMembers(projectId: number): Observable<MembersResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<MembersResponse>(`${this.apiUrl}/projects/${projectId}/members`, { headers });
  }
}