import { Component } from '@angular/core';
import { RazaMascota } from '../models/razas.model';
import { RazasService } from '../services/razas.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-razas-mascotas',
  standalone: false,
  templateUrl: './razas-mascotas.component.html',
  styleUrl: './razas-mascotas.component.css'
})
export class RazasMascotasComponent {
  raza: RazaMascota = {
    nombre: '',
    especie: '',
    tamano: '',
    pesoPromedio: '',
    esperanzaVida: '',
    colorTipico: '',
    tipoPelaje: '',
    alturaPromedio: '',
    temperamento: '',
    nivelEnergia: '',
    inteligencia: '',
    cuidadosEspeciales: '',
    paisOrigen: '',
    popularidad: '',
    fechaRegistro: undefined,
    notasAdicionales: '',
  };

  razas: RazaMascota[] = []; //Permite almacenar la informacion de las mascotas
  razasPaginadas: RazaMascota[] = []; // Para las razas visibles en la página actual
  filtro: string = ''; //Permite realizar el filtado, es decir almacenar aquellos datos que sean filtrados
  mostrarFormulario: boolean = false; //Permite mostrar el formulario en caso de ser true o false y no mostrarlo.
  mensajeExito: boolean = false; //Permite mostrar el mensaje en caso de ser true o false y no mostrarlo.
  modoEdicion: boolean = false; //Permite mostrar el formulario en caso de ser true o false y no mostrarlo.
  razaId: string | null = null; //Almacena el id de la raza

  // Variables de paginación
  pageSize = 7; // Cantidad de elementos por página
  currentPage = 1; // Página actual
  totalPages = 0; // Total de páginas calculadas

  //Variables para manejar los modales
  modalVisible: boolean = false; // Controla la visibilidad del modal de confirmación
  modalTitle: string = ''; // Título del modal de confirmación
  modalMessage: string = ''; // Mensaje del modal de confirmación
  modalCallback: (() => void) | null = null; // Función a ejecutar al confirmar

  finalModalVisible: boolean = false; // Controla la visibilidad del modal final
  finalModalMessage: string = ''; // Mensaje del modal final

  modalEliminarVisible: boolean = false; // Controla la visibilidad del modal de eliminación
  modalEliminarMessage: string = ''; // Mensaje del modal de eliminación
  idRazaAEliminar: string | null = null; // ID de la raza a eliminar

  // Variables para controlar la raza seleccionada y el modal
  razaSeleccionada: RazaMascota | null = null;
  verModalVisible: boolean = false;

  constructor(private razasService: RazasService) {}

  ngOnInit(): void {
    this.razasService
      .obtenerRazas() //Se obtienen las razas existentes
      .pipe(
        map((data) =>
          data.map((e) => ({
            uid: e.payload.doc.id || '',
            ...(e.payload.doc.data() as RazaMascota),
          }))
        )
      )
      .subscribe((razas: RazaMascota[]) => {
        this.razas = razas;
        this.totalPages = Math.ceil(this.razas.length / this.pageSize); // Calcula las páginas totales
        this.updateRazasPaginadas(); // Actualiza las razas visibles en la página actual
      });
  }

  //Funcion que realiza la edicion de la informacion de una raza seleccionada
  editarRaza(raza: RazaMascota) {
    this.raza = { ...raza }; // Copiar los datos de la raza seleccionada
    this.modoEdicion = true;
    this.razaId = raza.uid || null;
    this.mostrarFormulario = true;
  }

  //Funcion que permite editar o agrega la informacion de una raza deseada por el usuario
  agregarRaza() {
    if (this.modoEdicion && this.razaId) {
      // Se abre modal de confirmación al editar
      this.openModal(
        'Confirmar cambios',
        `¿Está seguro de que desea guardar los cambios para la raza "${this.raza.nombre}"?`,
        () => {
          this.razasService.actualizarRaza(this.razaId!, this.raza).then(() => {
            this.cerrarFormulario();
            this.mostrarMensajeDinamico(`Los cambios para la raza "${this.raza.nombre}" se han guardado con éxito.`);
          });
        }
      );
    } else {
      // Se agregar nueva raza
      this.raza.fechaRegistro = new Date(); // Asignar fecha de registro actual
      this.razasService.agregarRaza(this.raza).then(() => {
        this.cerrarFormulario();
        this.mostrarMensajeDinamico(`La raza "${this.raza.nombre}" se ha registrado con éxito.`);
      });
    }
  }

  //FUncion que permite realizar la apertura del modal para continuar con la eliminacion
  eliminarRaza(id: string, nombre: string) {
    this.openEliminarModal(id, nombre); // Abre el modal de eliminación
  }

  // Abre el modal de eliminación
openEliminarModal(id: string, nombre: string) {
  this.modalEliminarMessage = `¿Está seguro de que desea eliminar la raza "${nombre}"?`;
  this.modalEliminarVisible = true;
  this.idRazaAEliminar = id;
}

// Confirma la eliminación y cierra el modal
confirmarEliminar() {
  if (this.idRazaAEliminar) {
    this.razasService.eliminarRaza(this.idRazaAEliminar).then(() => {
      this.mostrarMensajeDinamico(`La raza ha sido eliminada con éxito.`);
    });
    this.idRazaAEliminar = null;
  }
  this.modalEliminarVisible = false; // Cierra el modal de eliminación
}

// Cancela la eliminación y cierra el modal
cancelarEliminar() {
  this.modalEliminarVisible = false; // Cierra el modal
  this.idRazaAEliminar = null;
}

  //Abre el formulario para agregar o editar
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.raza = {
      nombre: '',
      especie: '',
      tamano: '',
      pesoPromedio: '',
      esperanzaVida: '',
      colorTipico: '',
      tipoPelaje: '',
      alturaPromedio: '',
      temperamento: '',
      nivelEnergia: '',
      inteligencia: '',
      cuidadosEspeciales: '',
      paisOrigen: '',
      popularidad: '',
      fechaRegistro: undefined,
      notasAdicionales: '',
    }; // Limpiar el formulario
  }

  //Cierra el formulario
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.razaId = null;
  }

    // Actualiza las razas visibles según la página actual
    updateRazasPaginadas() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.razasPaginadas = this.razas.slice(startIndex, endIndex);
    }

    // Cambia la página
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateRazasPaginadas();
      }
    }

    // Avanza a la siguiente página
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateRazasPaginadas();
      }
    }

    // Retrocede a la página anterior
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateRazasPaginadas();
      }
    }

    // Abre el modal de confirmación
openModal(title: string, message: string, callback: () => void) {
  this.modalTitle = title;
  this.modalMessage = message;
  this.modalCallback = callback;
  this.modalVisible = true;
}

// Ejecuta la acción del modal y lo cierra
confirmModal() {
  if (this.modalCallback) {
    this.modalCallback(); // Ejecuta la acción confirmada
  }
  this.modalVisible = false; // Cierra el modal
}

// Cancela el modal
cancelModal() {
  this.modalVisible = false; // Solo cierra el modal
}

// Abre el modal final con un mensaje
showFinalModal(message: string) {
  this.finalModalMessage = message;
  this.finalModalVisible = true;
}

// Cierra el modal final
closeFinalModal() {
  this.finalModalVisible = false;
}

// Función para abrir el modal y mostrar la raza seleccionada
verDetallesRaza(raza: RazaMascota) {
  this.razaSeleccionada = raza;
  this.verModalVisible = true;
}

// Función para cerrar el modal
cerrarModalVer() {
  this.razaSeleccionada = null;
  this.verModalVisible = false;
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
}
