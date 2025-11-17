import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

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

  searchQuery: string = '';
  showSkillsDropdown: boolean = false;

  availableSkills = [
    { name: 'Ilustración', selected: false },
    { name: 'Diseño Gráfico', selected: false },
    { name: 'Diseño 3D', selected: false },
    { name: 'Edición de Fotos', selected: false },
    { name: 'Tipografía', selected: false },
    { name: 'Animación 2D', selected: false },
    { name: 'Animación 3D', selected: false },
    { name: 'Modelado 3D', selected: false },
    { name: 'Concept Art', selected: false }
  ];

  artists: Artist[] = [
    {
      id: 1,
      name: 'María',
      lastname: 'González',
      alias: 'maria_design',
      email: 'maria.gonzalez@email.com',
      bio: 'Ilustradora digital con 5 años de experiencia en concept art y diseño de personajes.',
      skills: ['Ilustración', 'Concept Art', 'Diseño Gráfico']
    },
    {
      id: 2,
      name: 'Carlos',
      lastname: 'Rodríguez',
      alias: 'carlos_3d',
      email: 'carlos.rodriguez@email.com',
      bio: 'Artista 3D especializado en modelado orgánico y texturizado para videojuegos.',
      skills: ['Modelado 3D', 'Diseño 3D', 'Animación 3D']
    },
    {
      id: 3,
      name: 'Ana',
      lastname: 'Martínez',
      alias: 'ana_animate',
      email: 'ana.martinez@email.com',
      bio: 'Animadora 2D con experiencia en motion graphics y series animadas.',
      skills: ['Animación 2D', 'Ilustración', 'Diseño Digital']
    },
    {
      id: 4,
      name: 'David',
      lastname: 'López',
      alias: 'david_photo',
      email: 'david.lopez@email.com',
      bio: 'Fotógrafo y editor profesional con enfoque en moda y retrato artístico.',
      skills: ['Edición de Fotos', 'Diseño Gráfico', 'Tipografía']
    },
    {
      id: 5,
      name: 'Laura',
      lastname: 'Hernández',
      alias: 'laura_illust',
      email: 'laura.hernandez@email.com',
      bio: 'Ilustradora freelance especializada en libros infantiles y editorial.',
      skills: ['Ilustración', 'Tipografía', 'Concept Art']
    },
    {
      id: 6,
      name: 'Javier',
      lastname: 'Sánchez',
      alias: 'javier_vfx',
      email: 'javier.sanchez@email.com',
      bio: 'Artista VFX y 3D generalista con experiencia en publicidad y cine.',
      skills: ['Animación 3D', 'Modelado 3D', 'Edición de Fotos']
    }
  ];

  filteredArtists: Artist[] = [];

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.filteredArtists = [...this.artists];
  }

  toggleSkillsDropdown(): void {
    this.showSkillsDropdown = !this.showSkillsDropdown;
  }

  searchArtists(): void {
    this.filteredArtists = this.artists.filter(artist => {
      const matchesSearch = this.searchQuery === '' || 
                           artist.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           artist.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           artist.alias.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           artist.bio.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const selectedSkills = this.availableSkills
        .filter(s => s.selected)
        .map(s => s.name);
      
      const matchesSkills = selectedSkills.length === 0 || 
                           selectedSkills.some(skill => artist.skills.includes(skill));

      return matchesSearch && matchesSkills;
    });
  }

  viewArtistProfile(artist: Artist): void {
    this.router.navigate(['/artist', artist.id]);
  }
}