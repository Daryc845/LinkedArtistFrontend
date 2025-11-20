// components/artist-dashboard/dashboard.component.ts

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistDashboardService } from '../../services/dashboard.service';
import { ArtistFilterRequest } from '../../models/requests/dashboard.requests';

// Interface local para el componente
interface Artist {
  id: number;
  name: string;
  lastname: string;
  alias: string;
  email: string;
  bio: string;
  skills: string[];
}

@Component({
  standalone: true,
  selector: 'app-artists-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit {

  // Variables de búsqueda y filtros
  searchQuery: string = '';
  showSkillsDropdown: boolean = false;

  // Habilidades disponibles
  availableSkills = [
    { name: 'Dibujo', id: 1, selected: false },
    { name: 'Pintura', id: 2, selected: false },
    { name: 'Animacion', id: 3, selected: false },
    { name: 'Escultura', id: 4, selected: false },
    { name: 'Grabado', id: 5, selected: false }
  ];

  // Artistas filtrados que se muestran en pantalla
  filteredArtists: Artist[] = [];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private artistDashboardService: ArtistDashboardService
  ) {}

  ngOnInit(): void {
    // Cargar todos los artistas inicialmente (búsqueda vacía)
    this.searchArtists();
  }

  /**
   * Toggle dropdown de habilidades
   */
  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  /**
   * Buscar artistas según filtros
   * Endpoint: POST /user/filter
   * Se ejecuta cuando se presiona el botón "Buscar"
   */
  searchArtists(): void {
    // Obtener habilidades seleccionadas
    const selectedSkills = this.availableSkills
      .filter(s => s.selected)
      .map(s => ({ id: s.id }));

    // Construir request según el endpoint
    const request: ArtistFilterRequest = {
      nickname: this.searchQuery,
      skills: selectedSkills
    };

    this.artistDashboardService.filterArtists(request).subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          // Transformar la respuesta del backend al formato local
          this.filteredArtists = response.data.artists.map(artist => ({
            id: artist.userid,
            name: '', // El backend solo retorna nickname y bio
            lastname: '',
            alias: artist.nickname,
            email: '',
            bio: artist.biography,
            skills: artist.skills.map(s => s.name)
          }));
        }
      },
      error: (error) => {
        console.error('Error al buscar artistas:', error);
        this.snackBar.open('Error al buscar artistas', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Ver perfil del artista
   */
  viewArtistProfile(artist: Artist): void {
    this.router.navigate(['/artist', artist.id]);
  }
}