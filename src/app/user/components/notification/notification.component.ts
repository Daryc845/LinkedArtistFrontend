// components/notifications/notification.component.ts

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';
import { 
  MarkNotificationReadRequest, 
  DeleteNotificationRequest 
} from '../../models/requests/notification.requests';

// Interface local para el componente
interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'request';
  read: boolean;
}

@Component({
  standalone: true,
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  
  // ID del usuario actual (obtener del localStorage o servicio de auth)
  currentUserId: number = 1; // TODO: Obtener del localStorage o auth service

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Obtener userid del localStorage
    // const userDataString = localStorage.getItem('userData');
    // if (userDataString) {
    //   const userData = JSON.parse(userDataString);
    //   this.currentUserId = userData.userid;
    // }
    
    this.loadNotifications();
  }

  /**
   * Cargar todas las notificaciones del usuario
   * Endpoint: GET /notifications/{id}
   */
  loadNotifications(): void {
    this.notificationService.getNotifications(this.currentUserId).subscribe({
      next: (response) => {
        if (response.success) {
          // Transformar la respuesta del backend al formato local
          this.notifications = response.body.notifications.map(n => ({
            id: n.notificationid,
            title: n.title,
            description: n.description,
            time: this.formatDate(n.date),
            type: this.mapNotificationType(n.type),
            read: n.wasRead
          }));
        }
      },
      error: (error) => {
        console.error('Error al cargar notificaciones:', error);
        this.snackBar.open('Error al cargar las notificaciones', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /**
   * Mapear tipo de notificación del backend al formato local
   */
  mapNotificationType(backendType: 'warning' | 'success' | 'informative' | 'application'): 'success' | 'info' | 'warning' | 'request' {
    const typeMap = {
      'success': 'success' as const,
      'informative': 'info' as const,
      'warning': 'warning' as const,
      'application': 'request' as const
    };
    return typeMap[backendType];
  }

  /**
   * Formatear fecha a texto legible (ej: "Hace 2 minutos")
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    }
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
  }

  /**
   * Marcar una notificación como leída
   * Endpoint: PATCH /notifications/read
   */
  markAsRead(notification: Notification): void {
    if (notification.read) return; // Ya está leída

    const request: MarkNotificationReadRequest = {
      userid: this.currentUserId,
      notificationid: notification.id
    };

    this.notificationService.markAsRead(request).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar localmente
          notification.read = true;
        }
      },
      error: (error) => {
        console.error('Error al marcar como leída:', error);
      }
    });
  }

  /**
   * Marcar todas las notificaciones como leídas
   * NOTA: El PDF no especifica este endpoint, por lo que se hace con múltiples llamadas
   */
  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) return;

    let completedRequests = 0;
    const totalRequests = unreadNotifications.length;

    unreadNotifications.forEach(notification => {
      const request: MarkNotificationReadRequest = {
        userid: this.currentUserId,
        notificationid: notification.id
      };

      this.notificationService.markAsRead(request).subscribe({
        next: (response) => {
          if (response.success) {
            notification.read = true;
            completedRequests++;

            // Mostrar mensaje solo cuando todas las peticiones hayan terminado
            if (completedRequests === totalRequests) {
              this.snackBar.open('Todas las notificaciones marcadas como leídas', 'Cerrar', {
                duration: 2000,
                panelClass: ['success-snackbar']
              });
            }
          }
        },
        error: (error) => {
          console.error('Error al marcar notificación como leída:', error);
          completedRequests++;

          if (completedRequests === totalRequests) {
            this.snackBar.open('Algunas notificaciones no se pudieron marcar', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        }
      });
    });
  }

  /**
   * Verificar si hay notificaciones sin leer
   */
  hasUnreadNotifications(): boolean {
    return this.notifications.some(notification => !notification.read);
  }

  /**
   * Obtener clase de icono según el tipo
   */
  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      'success': 'fa-solid fa-check-circle',
      'info': 'fa-solid fa-info-circle',
      'warning': 'fa-solid fa-exclamation-triangle',
      'request': 'fa-solid fa-user-plus'
    };
    return iconMap[type] || 'fa-solid fa-bell';
  }

  /**
   * Eliminar una notificación
   * Endpoint: DELETE /notifications
   */
  validateDelete(notification: Notification, event: Event): void {
    // Evitar que el click marque la notificación como leída
    event.stopPropagation();

    const confirmed = confirm("¿Deseas eliminar esta notificación?");
    if (!confirmed) return;

    const request: DeleteNotificationRequest = {
      userid: this.currentUserId,
      notificationid: notification.id
    };

    this.notificationService.deleteNotification(request).subscribe({
      next: (response) => {
        if (response.success) {
          // Eliminar localmente
          this.notifications = this.notifications.filter(n => n.id !== notification.id);

          this.snackBar.open('Notificación eliminada', 'Cerrar', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar notificación:', error);
        this.snackBar.open('Error al eliminar la notificación', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}