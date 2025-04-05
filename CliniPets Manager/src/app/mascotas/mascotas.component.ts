import { Raza, RazasService } from './../services/razas.service';
import { Component, OnInit } from '@angular/core';
import { MascotasService } from '../services/mascotas.service';
import { Mascotas } from '../models/mascotas.models';
import { map } from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css'],
  standalone: false
})
export class MascotasComponent implements OnInit {
  mascota: Mascotas = {
    nombreMascota: '',
    sexo: 'Macho',
    especie: '',
    tipoSangre: '',
    fechaNacimiento: new Date(),
    pesoActual: undefined,
    detallesExtra: '',
    estatusActividad: 'Activa',
    cedula: '',
    nombreDueno: '',
    contactoDueno: { telefono: '', correo: '' },
    fechaRegistro: new Date(),
  };
  razas: Raza[] = []; //Almacena las razas disponibles para mostrarlas
  mascotas: Mascotas[] = []; //Almacena las mascotas disponibles para mostrarlas
  filtro: string = ''; //Almacena los datos filtrados para mostrarlos
  mostrarFormulario: boolean = false; //Permite mostrar el formulario en caso de ser true y ocultarlo en caso de ser false
  mensajeExito: boolean = false; //Permite mostrar el mensaje en caso de ser true y ocultarlo en caso de ser false
  modoEdicion: boolean = false; //Permite mostrar el formulario en caso de ser true y ocultarlo en caso de ser false
  mascotaId: string | null = null; //Almacena el id de la mascota
  formSubmitted: boolean = false; //Permite mostrar el formulario en caso de ser true y ocultarlo en caso de ser false

   // Variables para el paginado
   currentPage: number = 1; // Página actual
   pageSize: number = 7; // Cantidad de registros por página
   totalPages: number = 0; // Total de páginas calculadas
   mascotasPaginadas: Mascotas[] = []; // Mascotas que se muestran en la página actual

  // Variables para el modal de visualización
  mascotaSeleccionada: Mascotas | null = null;
  verModalVisible: boolean = false;

  // Variable para la raza seleccionada
  razaSeleccionada: any = null;
  verModalRazaVisible: boolean = false;

  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  mascotaAEliminarId: string | null = null;  // Almacena el ID de la mascota a eliminar
  modalEliminarMessage: string = ''; //Modal que almacena el mensaje para eliminar una mascota

  filtroRaza: string = ''; // Campo para el filtro de búsqueda
  razasFiltradas: Raza[] = []; // Lista filtrada de razas


  constructor(private mascotasService: MascotasService, private RazasService: RazasService) {}

  ngOnInit(): void {
    this.RazasService.obtenerRazas2().subscribe((razas: Raza[]) => { //Se obtienen las razas existentes para realizar la creacion de una mascota o editarla
      this.razas = razas;
      this.filtrarRazas(); // Inicializa el filtro
    });
    this.mascotasService
  .obtenerMascota()
  .pipe(
    map((data) =>
      data.map((e) => {
        const rawData = e.payload.doc.data() as Mascotas;
        // Convierte los Timestamp a Date si es necesario, ya que firestore los realiza en Timestamp y angular usa DATE
        const fechaRegistro = rawData.fechaRegistro instanceof Timestamp ? rawData.fechaRegistro.toDate() : rawData.fechaRegistro;
        const fechaNacimiento = rawData.fechaNacimiento instanceof Timestamp ? rawData.fechaNacimiento.toDate() : rawData.fechaNacimiento;

        return {
          documentId: e.payload.doc.id,
          ...rawData,
          fechaRegistro, // Fecha ya convertida
          fechaNacimiento, // Fecha ya convertida
        };
      })
    )
  )
  .subscribe(
    (mascotas: Mascotas[]) => {
      this.mascotas = mascotas;
      this.calculatePagination(); //Realiza el calculo de la cantidad de paginas segun la cantidad de informacion existentes
    },
    (error) => {
      console.error('Error al obtener mascotas:', error);
    }
  );
  }

  //Funcion que permite realizar la edicion de una mascota
editarMascota(mascota: Mascotas & { documentId?: string }) {
  this.mascota = { ...mascota }; // Copiar todos los valores de la mascota seleccionada
  this.modoEdicion = true;
  this.mascotaId = mascota.documentId || null; // Almacena el ID del documento si existe
  this.mostrarFormulario = true;

  // Asegúrate de que la raza esté asignada correctamente
  const razaSeleccionada = this.razas.find((raza) => raza.nombre === mascota.raza?.nombre);
  if (razaSeleccionada) {
    this.mascota.raza = razaSeleccionada;
  }

  console.log('Mascota seleccionada para edición:', this.mascota);
}

//Funcion que permite agregar una mascota nueva, y a su vez en ella misma dependiendo la situacion, realiza la actualizacion.
  agregarMascota() {
    this.formSubmitted = true;
    if (this.modoEdicion) {
      if (this.mascotaId) {
        this.mascotasService
          .actualizarMascota(this.mascotaId, this.mascota)
          .then(() => {
            this.mostrarMensajeDinamico(`Mascota llamada "${this.mascota.nombreMascota}" actualizada con éxito`);
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            this.mostrarMensajeDinamico('Error al actualizar la mascota:', error);
          });
      }
    } else {
      this.modoEdicion = false; //Realiza que siempre que se inicie aqui en modo agregar nuevo para que funcione el form en modo agregar
      this.mascota.estatusActividad = 'Activa'; //Se define preterminadamente la mascota activa al agregarse inicialmente
      this.mascota.fechaRegistro = new Date();
      this.mascotasService.agregarMascota(this.mascota).then((docRef) => {  //Se usa la funcion que se encuentra en el service
        this.mensajeExito = true;
        this.mostrarMensajeDinamico(`Mascota llamada "${this.mascota.nombreMascota}" agregada con éxito!`);
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);

        // Limpiar el formulario y que quede con algunos espacios preterminados luego de limpiarse
        this.mascota = {
          nombreMascota: '',
          sexo: 'Macho',
          especie: '',
          tipoSangre: '',
          fechaNacimiento: new Date(),
          pesoActual: undefined,
          detallesExtra: '',
          estatusActividad: 'Activa',
          cedula: '',
          nombreDueno: '',
          contactoDueno: { telefono: '', correo: '' },
          fechaRegistro: new Date(),
        };
        this.cerrarFormulario();
      }).catch((error) => {
        console.error('Error al agregar la mascota:', error);
      });
    }
  }

   // Procesar la confirmación en el modal
   confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.mascotaAEliminarId) {
      this.mascotasService.eliminarMascota(this.mascotaAEliminarId)
        .then(() => {
          this.mostrarMensajeDinamico(`Mascota eliminada con éxito!`);
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.mascotas = this.mascotas.filter(m => m.documentId !== this.mascotaAEliminarId);
          this.calculatePagination(); // Actualiza la paginación
        })
        .catch((error) => {
          this.mostrarMensajeDinamico('Error al eliminar la mascota de Firestore:', error);
        });
    }
    this.mostrarModal = false;
  }

  //Funcion que realiza la eliminacion de una mascota
  eliminarMascota(id: string, nombreMascota: string) {
    this.mascotaAEliminarId = id;
    console.log('ID de la mascota a eliminar:', id); // Depura el valor de `id`
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar la mascota llamada "${nombreMascota}"?`;
    this.mostrarModal = true; // Mostrar el modal

  }

  //Funcion que abre el formulario
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.mascota = {
      nombreMascota: '',
      sexo: 'Macho',
      especie: '',
      tipoSangre: '',
      fechaNacimiento: new Date(),
      pesoActual: undefined,
      detallesExtra: '',
      estatusActividad: 'Activa',
      cedula: '',
      nombreDueno: '',
      contactoDueno: { telefono: '', correo: '' },
      fechaRegistro: new Date(),
    };
  }
  //Funcion que cierra el formulario
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.formSubmitted = false;
    this.modoEdicion = false;
  }

  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.mascotas.length / this.pageSize);
    this.updatePaginatedMascotas();
  }

  // Funcion que realiza la actualizacion de las mascotas que se muestran en la página actual
  updatePaginatedMascotas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.mascotasPaginadas = this.mascotas.slice(startIndex, endIndex);
  }

  // Funcion que realiza el cambio de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedMascotas();
    }
  }

  // Funcion que permite avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedMascotas();
    }
  }

  // Funcion que permite retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedMascotas();
    }
  }

//Funcion que permite realizar la eleccion de la raza
onRazaChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  if (target && this.mascota.raza) {
    const selectedRaza = this.mascota.raza; // `raza` ya tiene el objeto completo
    this.mascota.especie = selectedRaza.especie; // Actualizar especie automáticamente
  }
}

// Método para abrir el modal y mostrar la información de la mascota seleccionada
verDetallesMascota(mascota: Mascotas) {
  this.mascotaSeleccionada = mascota;
  this.verModalVisible = true;
}

// Método para cerrar el modal
cerrarModalVer() {
  this.mascotaSeleccionada = null;
  this.verModalVisible = false;
}

// Método para abrir el modal de detalles de la raza
verDetallesRaza(raza: any): void {
  if (raza) {
    this.razaSeleccionada = raza;
    this.verModalRazaVisible = true;
  }
}

// Método para cerrar el modal de detalles de la raza
cerrarModalRaza(): void {
  this.razaSeleccionada = null;
  this.verModalRazaVisible = false;
}

mensajeDinamico: string = ''; // Variable para el mensaje dinámico

//Muestra un mensaje dinamico deseado
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
mostrarModalRazas: boolean = false;

abrirModalRazas() {
  this.mostrarModalRazas = true;
}

cerrarModalRazas() {
  this.mostrarModalRazas = false;
}

// Método para filtrar las razas por nombre
filtrarRazas() {
  this.razasFiltradas = this.razas.filter((raza) =>
    raza.nombre.toLowerCase().includes(this.filtroRaza.toLowerCase())
  );
}

// Observa cambios en el filtro
ngOnChanges(): void {
  this.filtrarRazas();
}

//Metodo para seleccionar una raza
seleccionarRaza(raza: Raza) {
  this.mascota.raza = raza; // Asigna la raza seleccionada a la mascota
  this.mascota.especie = raza.especie; // Actualiza la especie de la mascota
  this.cerrarModalRazas(); // Cierra el modal
}

//Funcion que realiza la validacion de la cedula para que solo permita ingresar numeros y letras pero no carateres especiales
validarCedula(event: KeyboardEvent): void {
  const regex = /^[a-zA-Z0-9]*$/; // Solo permite letras y números
  const inputChar = String.fromCharCode(event.keyCode || event.which);

  if (!regex.test(inputChar)) {
    event.preventDefault(); // Bloquea la entrada si no coincide con la expresión regular
  }
}


}
