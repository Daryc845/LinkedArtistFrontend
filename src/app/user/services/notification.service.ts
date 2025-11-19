// services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { 
  MarkNotificationReadRequest, 
  DeleteNotificationRequest 
} from '../models/requests/notification.requests';
import { 
  NotificationsResponse, 
  NotificationActionResponse,
  NotificationData 
} from '../models/responses/notification.responses';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://partyst-api-gateway.onrender.com';

  constructor(private http: HttpClient) { }

  getNotifications(userid: number): Observable<NotificationsResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.get<NotificationsResponse>(`${this.apiUrl}/notifications/${userid}`);
    
    // ====== DATOS QUEMADOS - ELIMINAR CUANDO SE CONECTE AL BACKEND ======
    
    const mockNotifications: NotificationData[] = [
      {
        notificationid: 1,
        title: '¡Bienvenido a la plataforma!',
        description: 'Completa tu portafolio y comienza a colaborar en proyectos de diseño increíbles.',
        type: 'informative',
        date: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // Hace 2 minutos
        wasRead: false
      },
      {
        notificationid: 2,
        title: 'Solicitud aceptada',
        description: 'Tu solicitud para unirte al proyecto "Branding Café Aurora" ha sido aceptada. ¡Excelente trabajo!',
        type: 'success',
        date: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Hace 15 minutos
        wasRead: false
      },
      {
        notificationid: 3,
        title: 'Nueva solicitud de colaboración',
        description: 'Laura Méndez quiere que te unas a su proyecto "Ilustraciones para libro infantil". Revisa los detalles y responde.',
        type: 'application',
        date: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Hace 1 hora
        wasRead: false
      },
      {
        notificationid: 4,
        title: 'Tarea asignada',
        description: 'Te han asignado la tarea "Diseñar mockup final" en el proyecto "App de Gestión Creativa".',
        type: 'informative',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // Hace 3 horas
        wasRead: true
      },
      {
        notificationid: 5,
        title: 'Fecha límite próxima',
        description: 'La tarea "Bocetos del logo principal" vence en 2 días. ¡No olvides subir tu propuesta!',
        type: 'warning',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Hace 5 horas
        wasRead: true
      },
      {
        notificationid: 6,
        title: 'Comentario en tu proyecto',
        description: 'Diego Ramos ha comentado en tu proyecto "Rediseño Identidad Visual": "¡La paleta de colores quedó espectacular!"',
        type: 'informative',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
        wasRead: true
      },
      {
        notificationid: 7,
        title: 'Proyecto completado',
        description: 'El proyecto "Packaging Línea Orgánica" ha sido marcado como completado. ¡Gran trabajo creativo!',
        type: 'success',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
        wasRead: true
      },
      {
        notificationid: 8,
        title: 'Actualización de perfil',
        description: 'Tu portafolio ha sido actualizado exitosamente con tus nuevas habilidades en ilustración y UI/UX.',
        type: 'success',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Hace 3 días
        wasRead: true
      },
      {
        notificationid: 9,
        title: 'Nuevo mensaje',
        description: 'Camila Torres te ha enviado un mensaje sobre el proyecto "Diseño Web para Startup Tech".',
        type: 'informative',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Hace 4 días
        wasRead: true
      },
      {
        notificationid: 10,
        title: 'Invitación a proyecto',
        description: 'Has sido invitado a colaborar en "Campaña visual para ExpoCreativa 2024".',
        type: 'application',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 semana
        wasRead: true
      }
    ];

    return of({
      success: true,
      message: 'Notificaciones obtenidas exitosamente',
      body: {
        notifications: mockNotifications
      }
    });
    // ====== FIN DATOS QUEMADOS ======
  }

  /**
   * Marcar una notificación como leída
   * Endpoint: PATCH /notifications/read
   * Se usa cuando se presiona sobre una notificación
   */
  markAsRead(request: MarkNotificationReadRequest): Observable<NotificationActionResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.patch<NotificationActionResponse>(`${this.apiUrl}/notifications/read`, request);
    
    
    return of({
      success: true,
      message: 'Notificación marcada como leída'
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }

  /**
   * Eliminar una notificación
   * Endpoint: DELETE /notifications
   * Se usa cuando se presiona el botón X de eliminar
   */
  deleteNotification(request: DeleteNotificationRequest): Observable<NotificationActionResponse> {
    // BACKEND: Descomentar cuando esté listo el backend
    // return this.http.delete<NotificationActionResponse>(`${this.apiUrl}/notifications`, { body: request });
    
    
    return of({
      success: true,
      message: 'Notificación eliminada'
    });
    // ====== FIN RESPUESTA SIMULADA ======
  }
}