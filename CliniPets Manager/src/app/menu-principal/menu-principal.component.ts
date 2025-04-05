import { Component } from '@angular/core';
import { AuthloginService } from '../services/authlogin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  standalone: false,
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {

  constructor(private authService: AuthloginService, private router: Router) {}

  activeDropdown: string | null = null;
  usuario: { nombre: string; correo: string; rol?: string } | null = null; // Se incluye el rol desde Firestore

  ngOnInit(): void {
    this.authService.getUser2().subscribe({
      next: (data) => {
        if (data) {
          console.log('Usuario cargado:', data);
          this.usuario = data; // Asigna los datos al modelo `usuario`
        } else {
          console.warn('No hay datos de usuario.');
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      },
    });
  }

  //Metodo que realiza la prevencion de que se caiga la app en el navbar
  toggleDropdown(event: Event, dropdown: string): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.authService.logout().then(() => {
      console.log('Sesión cerrada');
      // Redirigir al login después de cerrar sesión
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
