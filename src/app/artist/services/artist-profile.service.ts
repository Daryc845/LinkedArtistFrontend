// services/artist-profile.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { 
  GetArtistRequest, 
  GetProjectInfoRequest 
} from '../models/requests/artist-profile.requests';
import { 
  ArtistProfileResponse, 
  ProjectDetailResponse,
  ArtistData,
  ProjectDetailData
} from '../models/responses/artist-profile.responses';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtistProfileService {
  private apiUrl = environment.prodUrl;

  constructor(private http: HttpClient) { }

  getArtistProfile(request: GetArtistRequest): Observable<ArtistProfileResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ArtistProfileResponse>(`${this.apiUrl}/user/${request.userid}/all`, {headers});
    
  }

  getProjectDetail(request: GetProjectInfoRequest): Observable<ProjectDetailResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ProjectDetailResponse>(`${this.apiUrl}/projects/${request.projectid}/bgetinfo`, { headers });
    
  }
}