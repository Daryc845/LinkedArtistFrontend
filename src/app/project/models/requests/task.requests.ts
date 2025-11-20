// models/requests/task.requests.ts

/**
 * Request para crear una nueva tarea
 * Endpoint: POST /task/create
 */
export interface CreateTaskRequest {
  projectId: number;
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
  assignedUserEmail: string;
}

/**
 * Request para actualizar una tarea existente
 * Endpoint: PUT /task/update
 */
export interface UpdateTaskRequest {
  projectId: number;
  taskId: number;
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
  assignedUserEmail: string;
}

/**
 * Request para eliminar una tarea
 * Endpoint: DELETE /task/delete
 */
export interface DeleteTaskRequest {
  taskId: number;
}
