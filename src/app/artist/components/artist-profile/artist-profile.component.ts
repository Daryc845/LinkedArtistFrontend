// components/artist-profile/artist-profile.component.ts

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistProfileService } from '../../services/artist-profile.service';
import { 
  GetArtistRequest, 
  GetProjectInfoRequest 
} from '../../models/requests/artist-profile.requests';

// Interfaces locales para el componente
interface Artist {
  id: number;
  name: string;
  lastname: string;
  alias: string;
  email: string;
  bio: string;
  skills: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  tasks?: {
    todo: string[];
    inProgress: string[];
    review: string[];
    done: string[];
  };
}

@Component({
  standalone: true,
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class ArtistProfileComponent implements OnInit {

  artist: Artist | null = null;
  artistProjects: Project[] = [];
  selectedProject: Project | null = null;
  artistId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar,
    private artistProfileService: ArtistProfileService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del artista desde la URL /artist/{id}
    this.route.params.subscribe(params => {
      this.artistId = +params['id'];
      
      if (this.artistId) {
        this.loadArtistProfile(this.artistId);
      } else {
        this.snackBar.open('ID de artista no válido', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/artists/dashboard']);
      }
    });
  }

  /**
   * Cargar perfil completo del artista con sus proyectos
   * Endpoint: GET /user/{id}/all
   */
  loadArtistProfile(userid: number): void {
    const request: GetArtistRequest = {
      userid: userid
    };

    this.artistProfileService.getArtistProfile(request).subscribe({
      next: (response) => {
        if (response.success) {
          // Transformar la respuesta del backend al formato local
          this.artist = {
            id: response.data.userid,
            name: response.data.name,
            lastname: response.data.lastname,
            alias: response.data.nickname,
            email: response.data.email,
            bio: response.data.biography,
            skills: response.data.skills.map(s => s.name)
          };

          // Transformar proyectos
          this.artistProjects = response.data.projects.map(p => ({
            id: p.projectid,
            title: p.title,
            description: p.description,
            category: p.category,
            skills: p.skills.map(s => s.name)
          }));
        } else {
          this.snackBar.open('Artista no encontrado', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.router.navigate(['/artists/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error al cargar perfil del artista:', error);
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/artists/dashboard']);
      }
    });
  }

  /**
   * Abrir modal con detalles del proyecto
   * Endpoint: GET /projects/{id}/bgetinfo
   */
  openProjectDetail(project: Project): void {
    const request: GetProjectInfoRequest = {
      projectid: project.id
    };

    this.artistProfileService.getProjectDetail(request).subscribe({
      next: (response) => {
        if (response.success) {
          // Organizar tareas por estado
          const tasks = {
            todo: [] as string[],
            inProgress: [] as string[],
            review: [] as string[],
            done: [] as string[]
          };

          response.data.tasks.forEach(task => {
            switch (task.state) {
              case 'to be done':
                tasks.todo.push(task.name);
                break;
              case 'in progress':
                tasks.inProgress.push(task.name);
                break;
              case 'under review':
                tasks.review.push(task.name);
                break;
              case 'done':
                tasks.done.push(task.name);
                break;
            }
          });

          // Actualizar proyecto seleccionado con información completa
          this.selectedProject = {
            id: project.id,
            title: response.data.title,
            description: response.data.description,
            category: response.data.category,
            skills: response.data.skills.map(s => s.name),
            tasks: tasks
          };
        }
      },
      error: (error) => {
        console.error('Error al cargar detalles del proyecto:', error);
        this.snackBar.open('Error al cargar los detalles del proyecto', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Cerrar modal de detalle del proyecto
   */
  closeProjectDetail(): void {
    this.selectedProject = null;
  }

  /**
   * Volver a la página anterior
   */
  goBack(): void {
    this.location.back();
  }
}