import { Component, EventEmitter, Output } from '@angular/core';
import { userI } from '../../interface/register.interface';
import { FirestoreService } from '../services/firestore.service';
import { RegisterService } from '../services/register.service';
import { EncryptionService } from '../services/encryption.service';


@Component({
  selector: 'app-register-user',
  standalone: false,
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})

export class RegisterUserComponent {
  @Output() onRegisterSuccess = new EventEmitter<void>(); // Emite un evento al completar el registro exitoso

  datos: userI = {
    nombre: '',
    correo: '',
    uid: '',
    password: '',
    rol: '',
  };

  passwordStrength: number = 0;
  confirmPassword: string = ''; // Propiedad para confirmar la contraseña

  passwordCriteria = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  };

  errors = {
    nombre: '',
    correo: '',
    rol: '',
    password: '',
    confirmPassword: '', // Error para la confirmación de la contraseña
  };

  constructor(
    private register: RegisterService,
    private firestore: FirestoreService,
    private encryptionService: EncryptionService // Servicio de cifrado
  ) {}

  ngOnInit() {}

async registrar() {
  this.validateFields();

  if (this.hasErrors()) {
    return;
  }

  console.log('Datos ->', this.datos);

  try {
    // Registrar al usuario en Firebase Authentication
    const rest = await this.register.registrarUser(this.datos);

    if (rest) {
      const path = 'Usuarios';
      const id = rest.user?.uid;

      if (id) {
        // Cifrar la contraseña antes de almacenarla en Firestore
        const encryptedPassword = this.encryptionService.encrypt(this.datos.password);

        // Guardar la información del usuario en Firestore
        await this.firestore.createDoc(
          { ...this.datos, password: encryptedPassword },
          path,
          id
        );
      }

      // Restaurar la sesión del administrador (incluido en el método `registrarUser`)
      console.log('Usuario registrado correctamente y sesión del administrador restaurada.');

      // Resetear el formulario
      this.resetForm();

      // Emitir el evento para indicar éxito
      this.onRegisterSuccess.emit();
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
  }
}

//Funcion que valida los espacios de nombre, contraseña y demas
  validateFields() {
    this.errors.nombre = this.datos.nombre.trim() ? '' : 'El nombre es obligatorio.';
    this.errors.correo = this.validateEmail(this.datos.correo)
      ? ''
      : 'Debe ingresar un correo electrónico válido eg: usuario@gmail.com, etc.';
    this.errors.rol = this.datos.rol.trim() ? '' : 'El rol es obligatorio.';

    // Validación de la contraseña
    if (!this.validatePassword(this.datos.password)) {
      this.errors.password = 'La contraseña no cumple con los requisitos.';
    } else {
      this.errors.password = '';
    }

    // Validación de la confirmación de la contraseña
    this.errors.confirmPassword =
      this.datos.password === this.confirmPassword
        ? ''
        : 'Las contraseñas no coinciden.';
  }



  hasErrors(): boolean {
    return Object.values(this.errors).some(error => error !== '');
  }

  //funcion que valida que el correo sea valido
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|es|co|edu)$/i;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return Object.values(this.passwordCriteria).every(value => value);
  }

  //funcion que chequea que se agreguen valores especificos a la contraseña
  checkPasswordStrength(password: string) {
    this.passwordCriteria.minLength = password.length >= 6;
    this.passwordCriteria.upperCase = /[A-Z]/.test(password);
    this.passwordCriteria.lowerCase = /[a-z]/.test(password);
    this.passwordCriteria.number = /\d/.test(password);
    this.passwordCriteria.specialChar = /[@$!%*?&]/.test(password);

    const fulfilledCriteria = Object.values(this.passwordCriteria).filter(
      value => value
    ).length;

    this.passwordStrength = (fulfilledCriteria / 5) * 100;
  }

  resetForm() {
    this.datos = {
      nombre: '',
      correo: '',
      uid: '',
      password: '',
      rol: '',
    };
    this.confirmPassword = '';
    this.passwordStrength = 0;

    // Restablece los errores
    this.errors = {
      nombre: '',
      correo: '',
      rol: '',
      password: '',
      confirmPassword: '',
    };

    // Restablece los criterios de contraseña
    this.passwordCriteria = {
      minLength: false,
      upperCase: false,
      lowerCase: false,
      number: false,
      specialChar: false,
    };
  }
}
