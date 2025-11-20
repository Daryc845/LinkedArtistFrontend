// services/artist-dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ArtistFilterRequest } from '../models/requests/dashboard.requests';
import { 
  ArtistFilterResponse, 
} from '../models/responses/dashboard.responses';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ArtistDashboardService {
  private apiUrl = environment.prodUrl;

  constructor(private http: HttpClient) { }

  filterArtists(request: ArtistFilterRequest): Observable<ArtistFilterResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ArtistFilterResponse>(`${this.apiUrl}/user/filter`, request, { headers });
  }
}