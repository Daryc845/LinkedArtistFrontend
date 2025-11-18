// models/requests/notification.requests.ts

/**
 * Request para marcar una notificación como leída
 * Endpoint: PATCH /notifications/read
 * Se usa cuando se presiona sobre una notificación
 */
export interface MarkNotificationReadRequest {
  userid: number;
  notificationid: number;
}

/**
 * Request para eliminar una notificación
 * Endpoint: DELETE /notifications
 * Se usa cuando se presiona el botón X de eliminar notificación
 */
export interface DeleteNotificationRequest {
  userid: number;
  notificationid: number;
}