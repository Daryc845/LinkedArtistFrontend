// token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(this.base64UrlDecode(payload));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Helper para decodificar base64 URL
  private base64UrlDecode(str: string): string {
    // Reemplazar caracteres URL-safe
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Añadir padding si es necesario
    switch (output.length % 4) {
      case 0: break;
      case 2: output += '=='; break;
      case 3: output += '='; break;
      default: throw new Error('Base64 string malformada');
    }
    
    return output;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return null;
    }

    const decoded = this.decodeToken(token);
    
    if (decoded?.jti) {
      const userId = Number(decoded.jti);
      return userId;
    }
    
    console.log('No se encontró jti en el token');
    return null;
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.sub || decoded?.email || null;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.name || null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;

    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }
}