import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForgetPasswordRequest } from '../models/requests/forget-password.requests';
import { ValidateCodePasswordRequest } from '../models/requests/validate-code-password.requests';
import { ForgetPasswordResponse } from '../models/responses/forget-password.responses';
import { ValidateCodePasswordResponse } from '../models/responses/validate-code-password.responses';
import { ResetPasswordRequest } from '../models/requests/reset-password.requests';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordService {
  private apiUrl = environment.prodUrl; // Ajusta según tu configuración

  constructor(private http: HttpClient) { }

  /**
   * Enviar código de recuperación al email
   * Endpoint: POST /auth/forgetPassword
   */
  forgetPassword(request: ForgetPasswordRequest): Observable<ForgetPasswordResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ForgetPasswordResponse>(
      `${this.apiUrl}/auth/forgetPassword`, 
      request, 
      { headers }
    );
  }

  /**
   * Validar código de recuperación
   * Endpoint: POST /auth/validateCodePassword
   */
  validateCodePassword(request: ValidateCodePasswordRequest): Observable<ValidateCodePasswordResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ValidateCodePasswordResponse>(
      `${this.apiUrl}/auth/validateCodePassword`, 
      request, 
      { headers }
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    return this.http.post<any>(
        `${this.apiUrl}/auth/resetPassword`, 
        request, 
        { headers }
    ).pipe(
        map((response : any) => ({
        success: response.code === 200,
        message: response.message,
        data: {
            updated: response.data
        }
        }))
    );
    }

  /**
   * Almacenar temporalmente el email para el flujo de recuperación
   */
  storeRecoveryEmail(email: string): void {
    sessionStorage.setItem('recovery_email', email);
  }

  /**
   * Obtener el email almacenado para el flujo de recuperación
   */
  getStoredRecoveryEmail(): string | null {
    return sessionStorage.getItem('recovery_email');
  }

  /**
   * Limpiar el email almacenado
   */
  clearStoredRecoveryEmail(): void {
    sessionStorage.removeItem('recovery_email');
  }
}