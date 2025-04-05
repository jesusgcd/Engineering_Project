import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FilterPipe } from '../filter.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Expediente } from '../models/expediente.model';
import { Mascotas } from '../models/mascotas.models';
import { ExpedientesService } from '../services/expedientes.service';
import { MascotasService } from '../services/mascotas.service';
import { ExpedienteDataService } from '../services/expediente-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css'],
  standalone: false,
})
export class ExpedientesComponent implements OnInit {
  expediente: Expediente = {
    idMascota: '', fechaCreacionExpediente: '', estatusActividad: 'Activo',
    nombreMascota: '',
    sexo: '',
    cedulaDueno: '',
    nombreDueno: ''
  };
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


  // crear una lista para agregar las mascotas y su correspondiente expediente
  expedientes: Expediente[] = [];
  listaMascotas: any[] = [];
  mensaje: string | null = null; // Mensaje para mostrar en el HTML
  esError: boolean = false; // Determina si es un error o un mensaje de éxito
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  mostrarModal: boolean = false;
  mostrarFormularioNotificacion: boolean = false;
  idExpedienteEliminar: string | null = null;  // Almacena el ID de la mascota a eliminar

  // Variables para el paginado
  currentPage: number = 1; // Página actual
  pageSize: number = 6; // Cantidad de registros por página
  totalPages: number = 0; // Total de páginas calculadas
  expedientesPaginadas: Expediente[] = []; // expedientes que se muestran en la página actual

  constructor(private router: Router,
    private expedientesService: ExpedientesService,
    private mascotasService: MascotasService,
    private expedienteDataService: ExpedienteDataService) { }


  // Método para inicializar el componente
  ngOnInit(): void {

    // Obtener los expedientes de Firebase
    this.expedientesService
      .obtenerExpedientes()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Expediente),
          }))
        )
      )
      .subscribe(
        (expedientes: Expediente[]) => {
          this.expedientes = expedientes;
          this.calculatePagination()
          //console.log('Expedientes:', this.expedientes);
        },
        (error) => {
          console.error('Error al obtener expedientes:', error);
        }
      );
  }


  agregarExpediente(mascota: Mascotas): void {

    // imprimir la mascota seleccionada
    //console.log('Mascota:', this.listaMascotas);

    // Crer nuevo Expediente
    this.expediente.idMascota = this.listaMascotas[0].id;
    this.expediente.nombreMascota = this.listaMascotas[0].nombreMascota;
    this.expediente.sexo = this.listaMascotas[0].sexo;
    this.expediente.cedulaDueno = this.listaMascotas[0].cedula;
    this.expediente.nombreDueno = this.listaMascotas[0].nombreDueno;
    // colocar la fecha actual en formato d/m/aaaa
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    this.expediente.fechaCreacionExpediente = `${dia}/${mes}/${anio}`;
    this.expediente.estatusActividad = 'Activo';

    this.expedientesService.agregarExpediente(this.expediente).then(() => {
      this.cerrarFormulario();
      this.mostrarFormularioNotificacion = true;
      setTimeout(() => {
        this.mostrarFormularioNotificacion = false;
      }, 550)
    });

    // console.log('id Mascota', this.listaMascotas[0].id); // forma para usar el id de la mascota
    // limpiar el expediente
    this.expediente = {
      idMascota: '', fechaCreacionExpediente: '', estatusActividad: 'Activo',
      nombreMascota: '',
      sexo: '',
      cedulaDueno: '',
      nombreDueno: ''
    };


  }

  buscarDatos(): void {
    // limpiar la lista de mascotas
    this.listaMascotas = [];
    const cedula = this.mascota.cedula;
    const nombreMascota = this.mascota.nombreMascota;

    // Validar que los campos no estén vacíos
    if (!cedula || !nombreMascota) {
      this.mostrarMensaje('Por favor, complete ambos campos antes de buscar.', true);
      return;
    }

    // Validar que la cédula solo tenga  letras (a-z, A-Z) y/o números (0-9)
    if (!this.validarSoloLetrasYNumeros(cedula)) {
      this.mostrarMensaje('La cédula debe solo puede tener letras y/o números caracteres.', true);
      return;
    }

    // Obtener las mascotas de Firebase
    this.mascotasService.obtenerMascota().subscribe(
      (response) => {
        this.listaMascotas = response
          .map((doc) => ({
            id: doc.payload.doc.id,
            ...doc.payload.doc.data(),
          }))
          .filter(
            (mascota: any) =>
              mascota.cedula === cedula && mascota.nombreMascota.toLowerCase() === nombreMascota.toLowerCase()
          );

        if (this.listaMascotas.length > 0) {
          this.mostrarMensaje('Mascota encontrada.', false);

          // validar que la mascota buscada no tenga un expediente
          const existeExpediente = this.expedientes.some(
            (expediente) => expediente.idMascota === this.listaMascotas[0].id
          );
          if (existeExpediente) {
            this.listaMascotas = [];
            this.mostrarMensaje('La mascota ya tiene un expediente.', true);
          }


        } else {
          this.mostrarMensaje('No se encontró ninguna mascota con los datos proporcionados.', true);
        }
      },
      (error) => {
        this.mostrarMensaje('Error al obtener datos de Firebase.', true);
        console.error(error);
      }
    );


  }

  validarSoloLetrasYNumeros(input: string): boolean {
    // Expresión regular que permite letras (a-z, A-Z) y números (0-9)
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(input);
  }

  // Método para eliminar un producto
  eliminarExpediente(id: string) {
    //console.log('Eliminar expediente:', id);
    this.idExpedienteEliminar = id;
    this.mostrarModal = true;
  }

  enviarIdExpedienteMascota(idExpedienteSource: string, idMascotaSource: string): void {
    //console.log('ID de la Expediente:', id);
    this.expedienteDataService.changeIdExpediente(idExpedienteSource, idMascotaSource); // Actualiza el ID de la Expediente
    this.router.navigate(['/detalles-expediente']); // Redirige a la página de detalles de la Expediente
  }

  // Procesar la confirmación en el modal
  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.idExpedienteEliminar) {
      this.expedientesService.eliminarExpediente(this.idExpedienteEliminar)
        .then(() => {
          console.log('Expediente eliminada con éxito');
        })
        .catch((error) => {
          console.error('Error al eliminar el Expediente: ', error);
        });
    }
    this.mostrarModal = false;  // Cerrar el modal
  }

  // Método auxiliar para mostrar el mensaje
  mostrarMensaje(mensaje: string, esError: boolean): void {
    this.mensaje = mensaje;
    this.esError = esError;

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensaje = null;
    }, 3000);
  }


  // Método para abrir el formulario de agregar producto
  abrirFormulario() {
    // limpiar la lista de mascotas
    this.listaMascotas = [];
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
    }; // Limpiar campos del formulario

  }


  // Método para cerrar el formulario de agregar producto
  cerrarFormulario() {
    this.mostrarFormulario = false;
    // limpiar la lista de mascotas
    this.listaMascotas = [];
  }



  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.expedientes.length / this.pageSize);
    this.updatePaginatedMascotas();
  }

  // Funcion que realiza la actualizacion de las mascotas que se muestran en la página actual
  updatePaginatedMascotas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.expedientesPaginadas = this.expedientes.slice(startIndex, endIndex);
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
}
