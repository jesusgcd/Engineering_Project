import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-confirm',
  standalone: false,

  templateUrl: './reset-password-confirm.component.html',
  styleUrl: './reset-password-confirm.component.css'
})
export class ResetPasswordConfirmComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  token: string = '';

    // Estado de validación de la contraseña
    passwordCriteria = {
      minLength: false,
      upperCase: false,
      lowerCase: false,
      specialChar: false
    };

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token']; // Captura el token desde la URL
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    this.http.post('https://apiusuarios-8cos.onrender.com/resetPassword', { token: this.token, newPassword: this.newPassword })
      .subscribe({
        next: (response: any) => {
          this.message = 'Contraseña restablecida con éxito. Por favor regrese a la aplicación de escritorio e inicie con la nueva contraseña...';
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.error.error || 'Ocurrió un error. Inténtalo de nuevo.';
          this.message = '';
        }
      });
  }

    // Método para validar la contraseña en tiempo real
    validatePassword() {
      const password = this.newPassword;
      this.passwordCriteria.minLength = password.length >= 6;
      this.passwordCriteria.upperCase = /[A-Z]/.test(password);
      this.passwordCriteria.lowerCase = /[a-z]/.test(password);
      this.passwordCriteria.specialChar = /[@$!%*?&]/.test(password);
    }

      // Método para verificar si la contraseña es válida
  isPasswordValid(): boolean {
    return Object.values(this.passwordCriteria).every(value => value) && this.newPassword === this.confirmPassword;
  }


}
