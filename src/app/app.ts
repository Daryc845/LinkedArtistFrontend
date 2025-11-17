import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected readonly title = signal('LinkedArtistFrontend');
  showSidebar = true;

  constructor(private router: Router, private snackBar: MatSnackBar) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route.snapshot.data;
        })
      )
      .subscribe(data => {
        this.showSidebar = !data['hideSidebar'];
      });
  }
  logout(): void {
    // BACKEND LOGOUT LOGIC HERE
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
        duration: 10000,
        panelClass: ['success-snackbar']
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['../../auth/login']);
  }
}
