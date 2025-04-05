import { Component } from '@angular/core';
import { ExpedientesService } from '../services/expedientes.service';
import { Router } from '@angular/router';
import { ExpedienteDataService } from '../services/expediente-data.service';
import { HojasInternamientoService } from '../services/hojas-internamiento.service';
import { HojaInternamiento } from '../models/hojaInternamiento.models';
import { Mascotas } from '../models/mascotas.models';
import { MascotasService } from '../services/mascotas.service';
import { FilterPipe } from '../filter.pipe';
import { Location } from '@angular/common';


@Component({
  selector: 'app-hojas-internamiento',
  templateUrl: './hojas-internamiento.component.html',
  styleUrl: './hojas-internamiento.component.css',
  standalone: false,
})
export class HojasInternamientoComponent {

  idExpediente: string | null = null;
  idMascota: string | null = null;
  idHojaEditando: string | null = null;
  idExpedienteEliminar: string | null = null;

  mascota: Mascotas | null = null; // Variable para almacenar la mascota
  mensaje: string | null = null; // Mensaje para mostrar en el HTML
  mensajeCreacionEdicion: string | null = null;
  esError: boolean = false; // Determina si es un error o un mensaje de éxito
  mostrarFormularioNotificacion: boolean = false;
  hojaInternamiento: HojaInternamiento = {
    IdMascota: '',
    IdExpediente: '',
    fechaIngreso: '',
    fechaEgreso: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    estado: 'Activo',
    usuarioCreador: '',
    fechaUltimaModificacion: '',
  };

  hojaInternamientos: HojaInternamiento[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  mostrarModal: boolean = false;


  constructor(
    private expedienteDataService: ExpedienteDataService,
    private router: Router,
    private expedientesService: ExpedientesService,
    private hojasInternamientoService: HojasInternamientoService,
    private mascotasService: MascotasService,
    private location: Location) { }

  ngOnInit(): void {
    this.idExpediente = this.expedienteDataService.getIdExpediente();
    this.idMascota = this.expedienteDataService.getIdMascota();

    if (this.idExpediente) {
      this.hojasInternamientoService.getHojasByExpediente(this.idExpediente).subscribe(
        (hojas) => {
          this.hojaInternamientos = hojas;
          // console.log('Hojas: ', this.hojaInternamientos);
        },
        (error) => {
          console.error('Error al obtener las hojas de internamiento:', error);
        }
      );
    }

    if (this.idMascota) {
      this.mascotasService
        .obtenerMascotaPorId(this.idMascota)
        .subscribe((mascota) => {
          if (mascota) {
            this.mascota = mascota;
          } else {
            this.mascota = null;
          }
        });
    }



  }

  editarHoja(idHoja: string, hoja: HojaInternamiento): void {

    if (idHoja) {
      this.modoEdicion = true;
      this.idHojaEditando = idHoja;

      this.hojaInternamiento = {
        ...hoja,
        fechaIngreso: hoja.fechaIngreso?.split('T')[0] || '',
        fechaEgreso: hoja.fechaEgreso?.split('T')[0] || '',
      };
      this.mostrarFormulario = true;
    }
  }




  eliminarHoja(idHoja: string) {
    if (idHoja) {
      this.idExpedienteEliminar = idHoja;
      this.mostrarModal = true;
    }
  }

  // Procesar la confirmación en el modal
  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.idExpedienteEliminar) {
      this.hojasInternamientoService.deleteHoja(this.idExpedienteEliminar)
        .then(() => {
          console.log('hoja Internamiento eliminada con éxito');
        })
        .catch((error) => {
          console.error('Error al eliminar la hoja Internamiento: ', error);
        });
    }
    this.mostrarModal = false;  // Cerrar el modal
    this.idExpedienteEliminar = ''; 
  }

  guardarHoja(): void {
    // Validar que los campos no estén vacíos
    if (
      this.hojaInternamiento.diagnostico.trim() === '' ||
      this.hojaInternamiento.fechaIngreso.trim() === '' ||
      this.hojaInternamiento.tratamiento.trim() === '' ||
      this.hojaInternamiento.usuarioCreador.trim() === ''
    ) {
      this.mostrarMensaje('Todos los campos son requeridos', true);
      return;
    }

    if (this.modoEdicion) {
      // Editar hoja existente
      this.hojasInternamientoService.updateHoja(this.idHojaEditando!, this.hojaInternamiento).then(() => {
        this.cerrarFormulario();
        this.mostrarFormularioNotificacion = true;
        this.mensajeCreacionEdicion = 'Hoja de internamiento actualizada con éxito!';
        setTimeout(() => {
          this.mostrarFormularioNotificacion = false;
        }, 2000);
      });
    } else {
      // Crear nueva hoja
      this.hojasInternamientoService.createHoja(this.hojaInternamiento).then(() => {
        this.cerrarFormulario();
        this.mostrarFormularioNotificacion = true;
        this.mensajeCreacionEdicion = 'Hoja de internamiento creada con éxito!';
        setTimeout(() => {
          this.mostrarFormularioNotificacion = false;
        }, 2000);
      });
    }
  }


  abrirFormulario() {
    this.mostrarFormulario = true;

    this.hojaInternamiento = {
      IdMascota: this.idMascota!,
      IdExpediente: this.idExpediente!,
      fechaIngreso: '',
      fechaEgreso: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      estado: 'Activo',
      usuarioCreador: '',
      fechaUltimaModificacion: new Date().toISOString(),
    }; // Limpiar el objeto

  }


  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idHojaEditando = null;
    this.hojaInternamiento = {
      IdMascota: '',
      IdExpediente: '',
      fechaIngreso: '',
      fechaEgreso: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      estado: 'Activo',
      usuarioCreador: '',
      fechaUltimaModificacion: '',
    };
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

  volverAtras(): void {
    this.location.back(); // Navega a la página anterior
  }

} // Fin de la clase HojasInternamientoComponent