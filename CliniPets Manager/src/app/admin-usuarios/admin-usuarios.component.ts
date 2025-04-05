import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { userI } from '../models/register.interface';
import { EncryptionService } from '../services/encryption.service';


@Component({
  selector: 'app-admin-usuarios',
  standalone: false,
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css'
})
export class AdminUsuariosComponent {
  isRegisterModalVisible = false; //Verifica si el modal es visible o no por medio de true or false
  finalModalVisible: boolean = false; //Verifica si el modal es visible o no por medio de true or false al final
  finalModalMessage: string = ''; //Es el mensaje final dado
  modalVisible: boolean = false; //Verifica si el modal es visible o no por medio de true or false
  modalTitle: string = ''; //Se refiere al titulo del modal
  modalMessage: string = ''; //Se refiere al mensaje dado en el modal
  modalCallback: (() => void) | null = null; //Es el llamado que se le realiza al modal
  usuarios: userI[] = []; // Usuarios cargados desde Firestore
  usuarios$: Observable<userI[]> | undefined; //En ello se almacena la informacion del usuario
  usuariosPaginados: userI[] = []; // Usuarios en la página actual
  usuariosFiltrados: userI[] = []; // Usuarios filtrados por la búsqueda
  pageSize = 8; // Cantidad de usuarios por página
  currentPage = 1; // Página actual
  totalPages = 0; // Total de páginas
  searchTerm: string = ''; // Término de búsqueda

  isEditModalVisible: boolean = false; // Controla la visibilidad del modal de edición
  usuarioSeleccionado: userI | null = null; // Usuario actualmente seleccionado para editar

  // Agregar un error para la contraseña editada en caso de ser necesario
  editPasswordError: string = '';

  constructor(private firestore: AngularFirestore, private encryptionService: EncryptionService) {}

    // Se da la validación para contraseñas en el modo de edición
    passwordEditCriteria = {
      minLength: false,
      upperCase: false,
      lowerCase: false,
      specialChar: false,
    };

    // Validar la contraseña editada
  validatePasswordEdit(password: string) {
    this.passwordEditCriteria.minLength = password.length >= 6;
    this.passwordEditCriteria.upperCase = /[A-Z]/.test(password);
    this.passwordEditCriteria.lowerCase = /[a-z]/.test(password);
    this.passwordEditCriteria.specialChar = /[@$!%*?&]/.test(password);

    const isValid = Object.values(this.passwordEditCriteria).every((value) => value);

    if (!isValid) {
      this.editPasswordError =
        'La contraseña debe tener al menos 6 caracteres, incluir una letra mayúscula, una minúscula y un carácter especial.';
    } else {
      this.editPasswordError = ''; // Limpiar el mensaje de error si es válido
    }
  }

  //Realiza la apertura del modal, ya que indica que esta visible
  openRegisterModal() {
    this.isRegisterModalVisible = true;
  }

  //Realiza el cierre del modal, ya que indica que no esta visible
  closeRegisterModal() {
    this.isRegisterModalVisible = false;
  }

ngOnInit() {
  this.firestore
    .collection<userI>('Usuarios')
    .valueChanges({ idField: 'uid' })
    .pipe(
      map((usuarios) => {
        const processedUsers = usuarios.map((usuario) => ({
          ...usuario,
          password: this.encryptionService.decrypt(usuario.password), // Descifrar la contraseña
          editCorreo: usuario.correo,
          editNombre: usuario.nombre,
          editRol: usuario.rol,
          editContrasena: this.encryptionService.decrypt(usuario.password), // Contraseña editable
        }));

        this.usuarios = processedUsers;
        this.usuariosFiltrados = [...this.usuarios]; // Inicialmente, todos los usuarios están visibles
        this.totalPages = Math.ceil(this.usuariosFiltrados.length / this.pageSize);
        this.updateUsuariosPaginados();
      })
    )
    .subscribe();
}


  // Actualiza los usuarios de la página actual
  updateUsuariosPaginados() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.usuariosPaginados = this.usuariosFiltrados.slice(startIndex, endIndex);
  }

  // Cambiar de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateUsuariosPaginados();
    }
  }

  // Generar un arreglo con los números de las páginas
  getPages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }
  //Muestra el modal
  openModal(title: string, message: string, callback: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalCallback = callback;
    this.modalVisible = true;
  }

  //
  confirmModal() {
    if (this.modalCallback) {
      this.modalCallback(); // Ejecuta la acción confirmada
    }
    this.modalVisible = false; // Cierra el modal
  }

  cancelModal() {
    this.modalVisible = false; // Solo cierra el modal
  }

//Funcion que guarda los cambios de los usuarios
guardarCambios() {
  if (this.usuarioSeleccionado) {
    const {
      uid,
      editNombre = '',
      editRol = '',
      editContrasena = ''
    } = this.usuarioSeleccionado;

    this.validatePasswordEdit(editContrasena);
    if (this.editPasswordError) {
      this.mostrarMensajeDinamico('La contraseña no cumple con los requisitos.');
      return;
    }

    const encryptedPassword = this.encryptionService.encrypt(editContrasena);

    this.openModal(
      'Guardar cambios',
      `¿Está seguro de guardar los cambios para el usuario "${editNombre}"?`,
      async () => {
        try {
          this.closeEditModal();

          // ✅ YA NO ACTUALIZAMOS EL CORREO AQUÍ
          // Actualizar contraseña en Firebase AUTH (en texto plano)
          if (editContrasena && editContrasena.trim() !== '') {
            await this.actualizarContrasena(uid, editContrasena);
          }

          // ✅ Solo actualizamos nombre, rol y contraseña cifrada en Firestore
          const updateData: Partial<userI> = { nombre: editNombre, rol: editRol };
          if (editContrasena) {
            updateData.password = encryptedPassword;
          }
          await this.actualizarUsuario(uid, updateData);

          // Actualizar la lista localmente
          const index = this.usuarios.findIndex((u) => u.uid === uid);
          if (index !== -1) {
            this.usuarios[index] = {
              ...this.usuarios[index],
              nombre: editNombre || this.usuarios[index].nombre,
              rol: editRol || this.usuarios[index].rol,
              password: editContrasena || this.usuarios[index].password,
            };
          }

          this.mostrarMensajeDinamico(
            `Los cambios para el usuario "${editNombre}" han sido guardados con éxito.`
          );
        } catch (error) {
          console.error('Error al guardar cambios:', error);
          this.mostrarMensajeDinamico(
            'Ocurrió un error al guardar los cambios. Por favor, inténtelo de nuevo.'
          );
        }
      }
    );
  }
}



//Funcion que permite el ocultar la contraseña
ocultarPassword(password: string | undefined): string {
  if (!password) {
    return '';
  }
  return '*'.repeat(password.length);
}

actualizarContrasena(uid: string, editContrasena: string) {
  // 🔹 Encripta la contraseña antes de guardarla en Firestore
  const encryptedPassword = this.encryptionService.encrypt(editContrasena);

  this.firestore.collection("Usuarios").doc(uid).update({ password: encryptedPassword }) // 🔹 Ahora se guarda cifrada
    .then(() => {
      console.log(`Contraseña encriptada y actualizada en Firestore para el usuario con UID: ${uid}`);
    })
    .catch((error) => {
      console.error('Error al actualizar la contraseña en Firestore:', error);
    });

  // 🔹 También actualiza la contraseña en Firebase Auth en texto plano
  fetch('https://apiusuarios-8cos.onrender.com/updatePassword', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, password: editContrasena }), // Aquí sí va en texto plano porque Firebase Auth maneja hashes internos
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log(`Contraseña actualizada en Firebase Auth para el usuario con UID: ${uid}`);
      } else {
        console.error(`Error al actualizar la contraseña en Firebase Auth: ${result.error}`);
      }
    })
    .catch((error) => {
      console.error('Error en la petición a Firebase Auth:', error);
    });
}



/*
//Funcion que realiza la actualizacion de la contraseña del usuario por medio de la API
actualizarContrasena(uid: string, editContrasena: string) {
  this.firestore.collection("Usuarios").doc(uid).update({ password: editContrasena })
  fetch('http://localhost:3000/updatePassword', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, password: editContrasena }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        console.log(`Contraseña actualizada para el usuario con UID: ${uid}`);

      } else {
        console.error(`Error al actualizar la contraseña: ${result.error}`);
      }
    })
    .catch((error) => {
      console.error('Error al actualizar la contraseña:', error);
    });
}

*/

//Actualiza el usaurio en la coleccion de firestore
  actualizarUsuario(uid: string, data: Partial<userI>) {
    // Actualizar campos específicos del usuario en Firestore
    this.firestore.collection('Usuarios').doc(uid).update(data).then(() => {
    });
  }

  actualizarCorreo(uid: string, nuevoCorreo: string) {
    console.log("Intentando actualizar el correo...");
    console.log("UID:", uid);
    console.log("Nuevo correo:", nuevoCorreo);

    fetch('https://apiusuarios-8cos.onrender.com/updateEmail', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email: nuevoCorreo }),
    })
      .then(response => {
        console.log("Respuesta de la API:", response);
        return response.json();
      })
      .then(result => {
        console.log("Resultado de la actualización:", result);
        if (result.success) {
          console.log("Correo actualizado correctamente.");
          this.showFinalModal(`El correo del usuario ha sido actualizado a "${nuevoCorreo}" con éxito.`);
        } else {
          console.error("Error desde la API:", result.error);
        }
      })
      .catch(error => {
        console.error('Error en el fetch:', error);
        this.showFinalModal(`Error inesperado al actualizar el correo.`);
      });
  }

  //Funcion que realiza la eliminacion de un usuario con ayuda de la API
  eliminarUsuario(uid: string, nombre: string) {
    // Abrir el modal de confirmación
    this.openModal(
      'Eliminar usuario',
      `¿Está seguro de eliminar al usuario "${nombre}"?`,
      async () => {
        try {
          // Cerrar el modal antes de proceder con la eliminación
          this.modalVisible = false;

          // Realizar la solicitud para eliminar al usuario
          const response = await fetch('https://apiusuarios-8cos.onrender.com/deleteUserAndFirestore', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid }),
          });

          const result = await response.json();

          if (result.success) {
            // Eliminar el usuario localmente
            this.usuarios = this.usuarios.filter((usuario) => usuario.uid !== uid);
            this.updateUsuariosPaginados();

            // Mostrar mensaje dinámico de éxito
            this.mostrarMensajeDinamico(`El usuario "${nombre}" ha sido eliminado con éxito.`);
          } else {
            // Mostrar mensaje dinámico de error
            this.mostrarMensajeDinamico(`Error eliminando al usuario "${nombre}".`);
          }
        } catch (error) {
          console.error('Error al eliminar al usuario:', error);
          // Mostrar mensaje dinámico de error
          this.mostrarMensajeDinamico(`Ocurrió un error al intentar eliminar al usuario "${nombre}".`);
        }
      }
    );
  }


  //Mostrar el modal final
  showFinalModal(message: string) {
    this.finalModalMessage = message;
    this.finalModalVisible = true;
  }

  //Cerrar el modal final
  closeFinalModal() {
    this.finalModalVisible = false;
  }

  // Buscar usuarios
  buscarUsuarios() {
    const search = this.searchTerm.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(search) ||
        usuario.correo.toLowerCase().includes(search) ||
        usuario.rol.toLowerCase().includes(search)
    );

    // Reiniciar la paginación con los resultados filtrados
    this.totalPages = Math.ceil(this.usuariosFiltrados.length / this.pageSize);
    this.currentPage = 1;
    this.updateUsuariosPaginados();
  }


  // Abrir el modal para editar un usuario
openEditModal(usuario: userI) {
  this.usuarioSeleccionado = { ...usuario }; // Crear una copia del usuario para editar
  this.isEditModalVisible = true; // Mostrar el modal

  // Evitar que el correo se modifique
  this.usuarioSeleccionado.editCorreo = usuario.correo;
}

// Cerrar el modal sin guardar
closeEditModal() {
  this.isEditModalVisible = false; // Ocultar el modal
  this.usuarioSeleccionado = null; // Limpiar el usuario seleccionado
}

// Método especial para confirmar y cerrar ambos modales
confirmModalAndCloseEdit() {
  if (this.modalCallback) {
    this.modalCallback(); // Ejecuta la acción confirmada
  }
  this.closeEditModal(); // Cierra el modal de edición
  this.modalVisible = false; // Cierra el modal de confirmación
}

mostrarContrasena: boolean = false;

//Funcion que permite mostrar y no la contraseña
togglePasswordVisibility(): void {
  this.mostrarContrasena = !this.mostrarContrasena;
}

mostrarPassword: { [key: string]: boolean } = {}; // Estado de visibilidad por usuario

// Alterna la visibilidad de la contraseña para un usuario específico
togglePasswordVisibilityM(uid: string): void {
  this.mostrarPassword[uid] = !this.mostrarPassword[uid];
}

// Devuelve una cadena de asteriscos del mismo tamaño que la contraseña
ocultarPasswordM(password: string): string {
  return '*'.repeat(password.length);
}

handleRegisterSuccess() {
  this.closeRegisterModal(); // Cierra el modal
  this.mostrarMensajeDinamico('Usuario registrado con éxito'); // Muestra el mensaje de  que a sido agregado
  this.ngOnInit(); // Recarga la lista de usuarios para reflejar los cambios
}

mensajeDinamico: string = ''; // Variable para el mensaje dinámico

mostrarMensajeDinamico(mensaje: string, cerrarFormulario: boolean = false, callback?: () => void) {
  if (this.mensajeDinamico) {
    // Evita que se muestre dos veces si ya hay un mensaje activo
    return;
  }

  this.mensajeDinamico = mensaje; // Asignar mensaje dinámico
  setTimeout(() => {
    this.mensajeDinamico = ''; // Limpiar el mensaje
    if (cerrarFormulario && callback) {
      callback(); // Ejecutar la función de cierre si se proporciona
    }
  }, 2000);
}

}
