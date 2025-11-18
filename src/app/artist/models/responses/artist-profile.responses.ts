// models/responses/artist-profile.responses.ts

/**
 * Información de un proyecto en el que el artista ha trabajado
 */
export interface ArtistProject {
  projectid: number;
  title: string;
  description: string;
  category: string;
  skills: Array<{ name: string }>;
}

/**
 * Información completa del artista con sus proyectos
 */
export interface ArtistData {
  userid: number;
  name: string;
  lastname: string;
  nickname: string;
  email: string;
  biography: string;
  skills: Array<{ name: string }>;
  projects: ArtistProject[];
}

/**
 * Respuesta al obtener información completa del artista
 * Endpoint: GET /user/{id}/all
 * Se usa cuando inicia la página, el ID se obtiene de la URL /artist/{id}
 */
export interface ArtistProfileResponse {
  success: boolean;
  message: string;
  data: ArtistData;
}

/**
 * Información de una tarea del proyecto
 */
export interface ProjectTask {
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
}

/**
 * Información detallada de un proyecto con tareas
 */
export interface ProjectDetailData {
  title: string;
  description: string;
  category: string;
  skills: Array<{ name: string }>;
  tasks: ProjectTask[];
}

/**
 * Respuesta al obtener información de un proyecto
 * Endpoint: GET /projects/{id}/bgetinfo
 * Se usa cuando se presiona sobre un proyecto del artista
 */
export interface ProjectDetailResponse {
  success: boolean;
  message: string;
  data: ProjectDetailData;
}