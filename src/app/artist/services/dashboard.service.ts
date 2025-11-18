// services/artist-dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ArtistFilterRequest } from '../models/requests/dashboard.requests';
import { 
  ArtistFilterResponse, 
  ArtistData 
} from '../models/responses/dashboard.responses';

@Injectable({
  providedIn: 'root'
})
export class ArtistDashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Filtrar artistas basado en alias y habilidades
   * Endpoint: POST /user/filter
   * Se usa cuando se presiona el botón "Buscar"
   */
  filterArtists(request: ArtistFilterRequest): Observable<ArtistFilterResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.post<ArtistFilterResponse>(`${this.apiUrl}/user/filter`, request);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    console.log('📤 Request enviado al backend:', request);
    
    const mockArtists: ArtistData[] = [
      {
        userid: 1,
        nickname: 'maria_design',
        biography: 'Ilustradora digital con 5 años de experiencia en concept art y diseño de personajes.',
        skills: [
          { name: 'Ilustración' },
          { name: 'Concept Art' },
          { name: 'Diseño Gráfico' }
        ]
      },
      {
        userid: 2,
        nickname: 'carlos_3d',
        biography: 'Artista 3D especializado en modelado orgánico y texturizado para videojuegos.',
        skills: [
          { name: 'Modelado 3D' },
          { name: 'Diseño 3D' },
          { name: 'Animación 3D' }
        ]
      },
      {
        userid: 3,
        nickname: 'ana_animate',
        biography: 'Animadora 2D con experiencia en motion graphics y series animadas.',
        skills: [
          { name: 'Animación 2D' },
          { name: 'Ilustración' },
          { name: 'Diseño Digital' }
        ]
      },
      {
        userid: 4,
        nickname: 'david_photo',
        biography: 'Fotógrafo y editor profesional con enfoque en moda y retrato artístico.',
        skills: [
          { name: 'Edición de Fotos' },
          { name: 'Diseño Gráfico' },
          { name: 'Tipografía' }
        ]
      },
      {
        userid: 5,
        nickname: 'laura_illust',
        biography: 'Ilustradora freelance especializada en libros infantiles y editorial.',
        skills: [
          { name: 'Ilustración' },
          { name: 'Tipografía' },
          { name: 'Concept Art' }
        ]
      },
      {
        userid: 6,
        nickname: 'javier_vfx',
        biography: 'Artista VFX y 3D generalista con experiencia en publicidad y cine.',
        skills: [
          { name: 'Animación 3D' },
          { name: 'Modelado 3D' },
          { name: 'Edición de Fotos' }
        ]
      }
    ];

    // Simular filtrado local (el backend lo hará)
    let filteredArtists = mockArtists;

    // Filtrar por nickname si existe
    if (request.nickname) {
      filteredArtists = filteredArtists.filter(artist =>
        artist.nickname.toLowerCase().includes(request.nickname.toLowerCase()) ||
        artist.biography.toLowerCase().includes(request.nickname.toLowerCase())
      );
    }

    // Filtrar por habilidades si existen
    if (request.skills.length > 0) {
      const selectedSkillNames = request.skills.map(skill => skill.name);
      filteredArtists = filteredArtists.filter(artist =>
        artist.skills.some(skill => selectedSkillNames.includes(skill.name))
      );
    }

    return of({
      success: true,
      message: 'Artistas filtrados exitosamente',
      data: {
        artists: filteredArtists
      }
    });
    // ====== FIN DATOS QUEMADOS ======
  }
}