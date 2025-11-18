// models/responses/notification.responses.ts

/**
 * Información de una notificación
 * Tipos: warning (alerta), success (exitosa), informative (informativa), application (solicitud)
 */
export interface NotificationData {
  notificationid: number;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'informative' | 'application';
  date: string;
  wasRead: boolean;
}

/**
 * Respuesta al obtener las notificaciones del usuario
 * Endpoint: GET /notifications/{id}
 * Se usa cuando se carga la página
 */
export interface NotificationsResponse {
  success: boolean;
  message: string;
  body: {
    notifications: NotificationData[];
  };
}

/**
 * Respuesta base para operaciones simples (marcar como leída, eliminar)
 * Endpoints: PATCH /notifications/read, DELETE /notifications
 */
export interface NotificationActionResponse {
  success: boolean;
  message: string;
}