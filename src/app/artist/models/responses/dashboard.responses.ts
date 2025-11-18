// models/responses/artist-dashboard.responses.ts

/**
 * Información básica de un artista
 */
export interface ArtistData {
  userid: number;
  nickname: string;
  biography: string;
  skills: Array<{ name: string }>;
}

/**
 * Respuesta al filtrar artistas
 * Endpoint: POST /user/filter
 * Se usa cuando se presiona el botón "Buscar"
 */
export interface ArtistFilterResponse {
  success: boolean;
  message: string;
  data: {
    artists: ArtistData[];
  };
}