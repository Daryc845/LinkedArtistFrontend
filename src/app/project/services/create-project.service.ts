import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectRequest } from '../models/requests/create-project.requests';
import { CreateProjectResponse } from '../models/responses/create-project.responses';
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = environment.prodUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  createProject(projectData: CreateProjectRequest): Observable<CreateProjectResponse> {
    const token = localStorage.getItem('access_token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<CreateProjectResponse>(`${this.apiUrl}/projects/create`, projectData, { headers });
  }
}