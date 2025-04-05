import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: false,

  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  message: string = '';
  errorMessage: string = '';
  @Output() close = new EventEmitter<void>();
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('https://apiusuarios-8cos.onrender.com/requestPasswordReset', { email: this.email }).subscribe({
      next: (response: any) => {
        this.message = 'Correo de recuperación enviado. Revisa tu bandeja de entrada e incluso bandeja de spam. Por favor no cierres la aplicación y dirigete a tu correo electrónico desde este mismo dispositivo';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Ocurrió un error. Inténtalo de nuevo.';
        this.message = '';
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}
