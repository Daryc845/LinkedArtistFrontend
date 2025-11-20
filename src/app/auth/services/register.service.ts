import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/requests/register.requests';
import { RegisterResponse } from '../models/responses/register.responses';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://partyst-java-backend-mnjv.onrender.com/auth/register';

  constructor(private http: HttpClient) { }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl, registerData);
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}