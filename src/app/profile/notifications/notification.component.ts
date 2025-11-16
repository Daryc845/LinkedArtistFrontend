import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  styleUrls: ['../profile-styles.css', './notification.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule],
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [
    {
        id: 1,
        title: '¡Bienvenido a la plataforma!',
        description: 'Completa tu portafolio y comienza a colaborar en proyectos de diseño increíbles.',
        time: 'Hace 2 minutos',
        type: 'info',
        read: false
    },
    {
        id: 2,
        title: 'Solicitud aceptada',
        description: 'Tu solicitud para unirte al proyecto "Branding Café Aurora" ha sido aceptada. ¡Excelente trabajo!',
        time: 'Hace 15 minutos',
        type: 'success',
        read: false
    },
    {
        id: 3,
        title: 'Nueva solicitud de colaboración',
        description: 'Laura Méndez quiere que te unas a su proyecto "Ilustraciones para libro infantil". Revisa los detalles y responde.',
        time: 'Hace 1 hora',
        type: 'request',
        read: false
    },
    {
        id: 4,
        title: 'Tarea asignada',
        description: 'Te han asignado la tarea "Diseñar mockup final" en el proyecto "App de Gestión Creativa".',
        time: 'Hace 3 horas',
        type: 'info',
        read: true
    },
    {
        id: 5,
        title: 'Fecha límite próxima',
        description: 'La tarea "Bocetos del logo principal" vence en 2 días. ¡No olvides subir tu propuesta!',
        time: 'Hace 5 horas',
        type: 'warning',
        read: true
    },
    {
        id: 6,
        title: 'Comentario en tu proyecto',
        description: 'Diego Ramos ha comentado en tu proyecto "Rediseño Identidad Visual": "¡La paleta de colores quedó espectacular!"',
        time: 'Hace 1 día',
        type: 'info',
        read: true
    },
    {
        id: 7,
        title: 'Proyecto completado',
        description: 'El proyecto "Packaging Línea Orgánica" ha sido marcado como completado. ¡Gran trabajo creativo!',
        time: 'Hace 2 días',
        type: 'success',
        read: true
    },
    {
        id: 8,
        title: 'Actualización de perfil',
        description: 'Tu portafolio ha sido actualizado exitosamente con tus nuevas habilidades en ilustración y UI/UX.',
        time: 'Hace 3 días',
        type: 'success',
        read: true
    },
    {
        id: 9,
        title: 'Nuevo mensaje',
        description: 'Camila Torres te ha enviado un mensaje sobre el proyecto "Diseño Web para Startup Tech".',
        time: 'Hace 4 días',
        type: 'info',
        read: true
    },
    {
        id: 10,
        title: 'Invitación a proyecto',
        description: 'Has sido invitado a colaborar en "Campaña visual para ExpoCreativa 2024".',
        time: 'Hace 1 semana',
        type: 'request',
        read: true
    }
    ];


  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Aquí cargarías las notificaciones desde el backend
    this.loadNotifications();
  }

  loadNotifications(): void {
    // BACKEND LOGIC TO FETCH NOTIFICATIONS
    // this.notificationService.getNotifications().subscribe({
    //   next: (notifications) => {
    //     this.notifications = notifications;
    //   },
    //   error: (error) => {
    //     this.snackBar.open('Error al cargar las notificaciones', 'Cerrar', {
    //       duration: 3000,
    //       panelClass: ['error-snackbar']
    //     });
    //   }
    // });
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      notification.read = true;
      
      // BACKEND LOGIC TO MARK AS READ
      // this.notificationService.markAsRead(notification.id).subscribe({
      //   next: () => {
      //     console.log('Notificación marcada como leída');
      //   },
      //   error: (error) => {
      //     console.error('Error al marcar notificación como leída', error);
      //   }
      // });
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });

    this.snackBar.open('Todas las notificaciones marcadas como leídas', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });

    // BACKEND LOGIC TO MARK ALL AS READ
    // this.notificationService.markAllAsRead().subscribe({
    //   next: () => {
    //     console.log('Todas las notificaciones marcadas como leídas');
    //   },
    //   error: (error) => {
    //     this.snackBar.open('Error al marcar notificaciones', 'Cerrar', {
    //       duration: 3000,
    //       panelClass: ['error-snackbar']
    //     });
    //   }
    // });
  }

  hasUnreadNotifications(): boolean {
    return this.notifications.some(notification => !notification.read);
  }

  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      'success': 'fa-solid fa-check-circle',
      'info': 'fa-solid fa-info-circle',
      'warning': 'fa-solid fa-exclamation-triangle',
      'request': 'fa-solid fa-user-plus'
    };
    return iconMap[type] || 'fa-solid fa-bell';
  }

  validateDelete(notification: Notification, event: Event): void {
    // Evitar que el click marque la notificación como leída
    event.stopPropagation();

    const confirmed = confirm("¿Deseas eliminar esta notificación?");
    if (!confirmed) return;

    this.notifications = this.notifications.filter(n => n.id !== notification.id);

    this.snackBar.open('Notificación eliminada', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });

    // BACKEND DELETE LOGIC HERE
    // this.notificationService.delete(notification.id).subscribe(...)
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}