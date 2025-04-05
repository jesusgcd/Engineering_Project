import { Component } from '@angular/core';
import { AuthloginService } from './services/authlogin.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project_ing_software20';
  showNavbar: boolean = true;

  userRole: string | null = null;

  constructor(private authService: AuthloginService, private router: Router) {}

  ngOnInit() {
    // Suscribirse al rol del usuario
    this.authService.getRole().subscribe((role) => {
      this.userRole = role;
    });

    const hiddenRoutes = ['/login']; // Rutas en las que no se muestra el navbar

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Oculta el navbar si la ruta actual está en hiddenRoutes
        this.showNavbar = !hiddenRoutes.includes(event.url);
      });
  }
}
