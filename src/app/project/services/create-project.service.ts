import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectRequest } from '../models/requests/create-project.requests';
import { CreateProjectResponse } from '../models/responses/create-project.responses';
import { HttpHeaders } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'https://partyst-api-gateway.onrender.com';

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  createProject(projectData: CreateProjectRequest): Observable<CreateProjectResponse> {
    // BACKEND CREATE PROJECT LOGIC HERE
    console.log('📤 Enviando solicitud de creación de proyecto:', projectData);
    const token = localStorage.getItem('access_token');
    console.log('🔍 Token para project.create:', token); // DEBUG
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<CreateProjectResponse>(`${this.apiUrl}/projects/create`, projectData, { headers });
  }
}