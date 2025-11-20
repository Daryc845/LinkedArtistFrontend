import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateUserRequest } from '../models/requests/dashboard.requests';
import { UserResponse, UpdateUserResponse, BaseResponse } from '../models/responses/dashboard.responses';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://partyst-java-backend-mnjv.onrender.com'; 

  constructor(private http: HttpClient) { }

  getUser(id: number): Observable<UserResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserResponse>(`${this.apiUrl}/user/${id}`, { headers } );
    
  }

  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<UpdateUserResponse>(`${this.apiUrl}/user/update`, request, { headers } );
  }

  deleteUser(id: number): Observable<BaseResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<BaseResponse>(`${this.apiUrl}/user/${id}/delete`, { headers } );
  }
}