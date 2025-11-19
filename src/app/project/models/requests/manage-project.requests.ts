// models/requests/manage-project.requests.ts

/**
 * Request para actualizar información de un proyecto
 * Endpoint: PUT /projects/update
 * Se usa cuando se presiona "Guardar cambios" en el panel principal
 */
export interface UpdateProjectRequest {
  projectId: number;
  title: string;
  description: string;
  categoryId: number;
  skills: Array<{ skillId: number }>;
}

/**
 * Request para crear una nueva tarea
 * Endpoint: POST /projects/tasks/create
 * Se usa cuando se presiona "Añadir tarea"
 */
export interface CreateTaskRequest {
  projectid: number;
  name: string;
  email?: string; // Opcional, email del encargado
}

/**
 * Request para actualizar el estado de una tarea (drag & drop)
 * Endpoint: PUT /task/state
 * Se usa cuando se arrastra una tarea de un estado a otro
 */
export interface UpdateTaskStateRequest {
  taskId: number;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
}

/**
 * Request para editar una tarea completa
 * Endpoint: PUT /projects/tasks/update
 * Se usa cuando se presiona "Guardar cambios" en el modal de editar tarea
 */
export interface UpdateTaskRequest {
  projectid: number;
  taskid: number;
  name: string;
  state: 'to be done' | 'in progress' | 'under review' | 'done';
  email?: string; // Email de la persona encargada
}

/**
 * Request para eliminar una tarea
 * Endpoint: DELETE /task/delete
 * Se usa cuando se presiona "Eliminar" en el modal de editar tarea
 */
export interface DeleteTaskRequest {
  projectId: number;
  taskId: number;
}

/**
 * Request para eliminar un miembro del proyecto
 * Endpoint: DELETE /projects/member
 * Se usa cuando se presiona eliminar miembro
 */
export interface RemoveMemberRequest {
  projectid: number;
  userid: number;
}

/**
 * Request para aceptar una solicitud
 * Endpoint: POST /projects/requests/accept
 * Se usa cuando se presiona "Aceptar" en el centro de solicitudes
 */
export interface AcceptRequestRequest {
  projectid: number;
  userid: number;
}

/**
 * Request para rechazar una solicitud
 * Endpoint: POST /projects/requests/decline
 * Se usa cuando se presiona "Rechazar" en el centro de solicitudes
 */
export interface RejectRequestRequest {
  projectid: number;
  userid: number;
}