import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/requests/login.requests';
import { LoginResponse } from '../models/responses/login.responses';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://partyst-java-backend.onrender.com/auth/login';

  constructor(private http: HttpClient) { }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, loginData);
  }

  // Método para almacenar tokens en localStorage
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Método para limpiar tokens (logout)
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}