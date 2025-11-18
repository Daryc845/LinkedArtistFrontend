// models/requests/artist-dashboard.requests.ts

/**
 * Request para filtrar artistas basado en alias y habilidades
 * Endpoint: POST /user/filter
 * Se usa cuando se presiona el botón "Buscar"
 */
export interface ArtistFilterRequest {
  nickname: string;
  skills: Array<{ name: string }>;
}