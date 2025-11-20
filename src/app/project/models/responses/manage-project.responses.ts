// models/responses/manage-project.responses.ts

/**
 * Respuesta base para operaciones simples
 */
export interface BaseResponse {
  code: number;
  message: string;
}

/**
 * Información de usuario en tareas
 */
export interface TaskUser {
  userid: number;
  name: string;
  lastname: string;
  nickname?: string;
  email: string;
}

/**
 * Información de una tarea del backend
 */
export interface TaskResponse {
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
  userId?: number;
}

/**
 * Información completa del proyecto desde el backend
 */
export interface ProjectData {
  projectId: number;
  name: string;
  users: any[];
  description: string;
  category: string;
  skills: Array<{ name: string }>;
  tasks: TaskResponse[];
}

/**
 * Respuesta al obtener información del proyecto
 * Endpoint: GET /projects/{id}
 * Se usa cuando se carga la página según el id de la URL
 */
export interface ProjectResponse {
  code: number;
  message: string;
  data: ProjectData;
}

/**
 * Información de un miembro del proyecto
 */
export interface Member {
  userid: number;
  name: string;
  lastname: string;
  nickname?: string;
  email: string;
  isOwner: boolean;
}

/**
 * Respuesta al obtener miembros
 * Endpoint: GET /projects/{id}/members
 * Se usa cuando se presiona "Ver integrantes"
 */
export interface MembersResponse {
  code: number;
  message: string;
  data: {
    members: Member[];
  };
}

/**
 * Información de una solicitud para unirse
 */
export interface JoinRequest {
  userid: number;
  name: string;
  lastname: string;
  nickname?: string;
  email: string;
  message: string;
  requestDate: String;
}

/**
 * Respuesta al obtener solicitudes
 * Endpoint: GET /projects/{id}/requests
 * Se usa cuando se presiona "Abrir centro de solicitudes"
 */
export interface RequestsResponse {
  code: number,
  message: string;
  data: {
    requests: JoinRequest[];
  };
}