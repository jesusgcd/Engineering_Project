import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthloginService } from '../services/authlogin.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  showResetPasswordModal: boolean = false;

  constructor(
    private authService: AuthloginService,
    private fb: FormBuilder,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 🔹 Función para obtener el rol del usuario desde Firestore
  async getUserRole(email: string): Promise<string | null> {
    try {
      const userSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('correo', '==', email)).get().toPromise();

      if (userSnapshot && !userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data() as any;
        return userData.rol || null; // 🔹 Retorna el rol si existe
      } else {
        return null; // 🔹 Usuario no encontrado en Firestore
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return null;
    }
  }

   // 🔹 Función de inicio de sesión con verificación de rol
   async login() {
    const { email, password } = this.loginForm.value;
    this.errorMessage = null;

    try {
      await this.authService.login(email, password);

      const role = await this.getUserRole(email); // 🔹 Busca el rol del usuario en Firestore

      if (role === "Administrador") {
        this.authService.setRole('admin');
        console.log("Inicio correcto de sesión como Administrador");
        this.router.navigate(["MenuInicialTodos"]); // 🔹 Redirige a la vista de administrador
      } else if (role) {
        this.authService.setRole('user');
        console.log("Inicio correcto de sesión como Usuario");
        this.router.navigate(["MenuInicialTodos"]); // 🔹 Redirige a la vista de usuario normal
      } else {
        this.errorMessage = "No se encontró el usuario en el sistema.";
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error.code === 'auth/too-many-requests') {
      this.errorMessage = 'Tu cuenta ha sido temporalmente bloqueada debido a demasiados intentos fallidos. Por favor, espera unos minutos antes de intentar nuevamente.';
    } else {
      this.errorMessage = 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.';
    }
  }

  openResetPasswordModal() {
    this.showResetPasswordModal = true;
  }

  closeResetPasswordModal() {
    this.showResetPasswordModal = false;
  }


}
