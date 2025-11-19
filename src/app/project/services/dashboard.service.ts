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
  private apiUrl = 'https://partyst-api-gateway.onrender.com';

  constructor(private http: HttpClient) { }

  filterProjects(request: ProjectFilterRequest): Observable<ProjectListResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
     return this.http.post<ProjectListResponse>(`${this.apiUrl}/projects/filter`, request, { headers });
  }

  joinProject(request: ProjectJoinRequest): Observable<ProjectJoinResponse> {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<ProjectJoinResponse>(`${this.apiUrl}/projects/join`, request, { headers } );
  }

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