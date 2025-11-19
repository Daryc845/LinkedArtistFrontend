// models/responses/task.responses.ts

/**
 * Información básica del usuario asignado a una tarea
 */
export interface UserBasicInfo {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  nickname: string;
}

/**
 * Respuesta completa de una tarea con información del usuario
 */
export interface TaskDetail {
  taskId: number;
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
  projectId: number;
  assignedUser: UserBasicInfo | null;
}

/**
 * Respuesta al crear o actualizar una tarea
 * Endpoint: POST /task/create o PUT /task/update
 */
export interface TaskResponse {
  code: number;
  message: string;
  data: TaskDetail;
}

/**
 * Respuesta al eliminar una tarea
 * Endpoint: DELETE /task/delete
 */
export interface DeleteTaskResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
    message: string;
  };
}
