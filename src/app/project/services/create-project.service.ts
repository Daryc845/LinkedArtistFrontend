import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectRequest } from '../models/requests/create-project.requests';
import { CreateProjectResponse } from '../models/responses/create-project.responses';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  createProject(projectData: CreateProjectRequest): Observable<CreateProjectResponse> {
    // BACKEND CREATE PROJECT LOGIC HERE
    return this.http.post<CreateProjectResponse>(`${this.apiUrl}/projects/create`, projectData);
  }
}