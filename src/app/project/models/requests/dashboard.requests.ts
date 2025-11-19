// models/requests/dashboard.requests.ts

/**
 * Request para filtrar proyectos
 * Endpoint: POST /projects/filter
 * Se usa cuando: se presiona una tecla en búsqueda, se selecciona categoría,
 * se selecciona/quita habilidad, o se presiona algún botón de vista
 */
export interface ProjectFilterRequest {
  title: string;
  category: string;
  type: 'public' | 'profile' | 'registered';
  userId: number;
  skills: Array<{ skillId: number; name: string }>;
  active: boolean;
}

/**
 * Request para enviar solicitud de unirse a un proyecto
 * Endpoint: POST /projects/join
 * Se usa cuando se presiona "Solicitar unirse" en el modal de proyecto
 */
export interface ProjectJoinRequest {
  projectId: number;
  userId: number;
}

/**
 * Request para obtener información básica de un proyecto
 * Endpoint: POST /projects/basic-info
 * Se usa cuando se presiona sobre un proyecto para ver detalles
 */
export interface ProjectBasicInfoRequest {
  projectid: number;
}
