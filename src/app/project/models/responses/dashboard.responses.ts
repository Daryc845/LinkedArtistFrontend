// models/responses/dashboard.responses.ts

/**
 * Información básica de un proyecto en la lista
 */
export interface ProjectBasic {
  projectId: number;
  name: string;
  description: string;
  category: string;
  skills?: Array<{ name: string }>;
}

export interface ProjectListWrapper {
  projects: ProjectBasic[];
}

export interface ProjectListResponse {
  code: number;
  message: string;
  data: ProjectListWrapper;
}

/**
 * Respuesta al solicitar unirse a un proyecto
 * Endpoint: POST /projects/join
 */
export interface ProjectJoinResponse {
  success: boolean;
  message: string;
}

/**
 * Información de una tarea en el proyecto
 */
export interface TaskBasic {
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
}

/**
 * Información detallada de un proyecto
 */
export interface ProjectDetail {
  projectId: number;
  name: string;
  description: string;
  category: string;
  skills: Array<{ name: string }>;
  tasks: TaskBasic[];
}

/**
 * Respuesta al obtener información básica de un proyecto
 * Endpoint: POST /projects/basic-info
 */
export interface ProjectBasicInfoResponse {
  code: number;
  message: string;
  data: ProjectDetail;
}