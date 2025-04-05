import { Component } from '@angular/core';
import { SeguimientoVacunasService } from '../services/seguimiento-vacunas.service';
import { ExpedienteDataService } from '../services/expediente-data.service';
import { Router } from '@angular/router';
import { MascotasService } from '../services/mascotas.service';
import { Mascotas } from '../models/mascotas.models';
import { SeguimientoVacunas } from '../models/seguimientoVacunas.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seguimiento-vacunas',
  templateUrl: './seguimiento-vacunas.component.html',
  styleUrl: './seguimiento-vacunas.component.css',
  standalone: false,
})
export class SeguimientoVacunasComponent {

  idExpediente: string | null = null;
  idMascota: string | null = null;
  idVacunaEditando: string | null = null;
  idVacunaEliminar: string | null = null;

  mascota: Mascotas | null = null; // Variable para almacenar la mascota
  mensaje: string | null = null; // Mensaje para mostrar en el HTML
  mensajeCreacionEdicion: string | null = null;
  esError: boolean = false; // Determina si es un error o un mensaje de éxito
  mostrarFormularioNotificacion: boolean = false;
  vacunaSeguimiento: SeguimientoVacunas = {
    IdMascota: '',
    IdExpediente: '',
    tipoVacuna: '',
    fechaAplicacion: '',
    fechaProximaDosis: '',
    observaciones: '',
    estado: 'programada',
    usuarioResponsable: '',
    fechaUltimaModificacion: '',
  };

  vacunasSeguimiento: SeguimientoVacunas[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  mostrarModal: boolean = false;


  constructor(
    private expedienteDataService: ExpedienteDataService,
    private router: Router,
    private vacunasService: SeguimientoVacunasService,
    private mascotasService: MascotasService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.idExpediente = this.expedienteDataService.getIdExpediente();
    this.idMascota = this.expedienteDataService.getIdMascota();

    // traer las vacunas
    if (this.idExpediente) {
      this.vacunasService.getVacunasByExpediente(this.idExpediente).subscribe(
        (vacunas) => {
          this.vacunasSeguimiento = vacunas;
          //console.log('Hojas: ', this.vacunasSeguimiento);
        },
        (error) => {
          console.error('Error al obtener las vacunas:', error);
        }
      );
    }
    // traer la mascota
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
  }// fin ngOnInit

  editarVacuna(idVacuna: string, vacuna: SeguimientoVacunas): void {

    if (idVacuna) {
      this.modoEdicion = true;
      this.idVacunaEditando = idVacuna;

      this.vacunaSeguimiento = {
        ...vacuna,
        fechaAplicacion: vacuna.fechaAplicacion?.split('T')[0] || '',
        fechaProximaDosis: vacuna.fechaProximaDosis?.split('T')[0] || '',
      };
      this.mostrarFormulario = true;
    }
  }// fin editarVacuna


  eliminarVacuna(idVacuna: string) {
    if (idVacuna) {
      this.idVacunaEliminar = idVacuna;
      this.mostrarModal = true;
    }
  }// fin eliminarVacuna


  // Procesar la confirmación en el modal
  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.idVacunaEliminar) {
      this.vacunasService.deleteVacuna(this.idVacunaEliminar)
        .then(() => {
          console.log('Vacuna eliminada con éxito');
        })
        .catch((error) => {
          console.error('Error al eliminar la Vacuna: ', error);
        });
    }
    this.mostrarModal = false;  // Cerrar el modal
    this.idVacunaEliminar = '';
  }// fin confirmarEliminacion

  guardarVacuna(): void {
    // Validar que los campos no estén vacíos
    if (
      this.vacunaSeguimiento.tipoVacuna.trim() === '' ||
      this.vacunaSeguimiento.fechaAplicacion.trim() === '' ||
      this.vacunaSeguimiento.observaciones!.trim() === '' ||
      this.vacunaSeguimiento.estado.trim() === '' ||
      this.vacunaSeguimiento.usuarioResponsable.trim() === '' ||
      this.vacunaSeguimiento.usuarioResponsable.trim() === ''
    ) {
      this.mostrarMensaje('Todos los campos son requeridos', true);
      return;
    }

    if (this.modoEdicion) {
      // Editar vacuna existente
      if (this.vacunaSeguimiento.fechaProximaDosis?.trim() === '') {
        this.vacunaSeguimiento.fechaProximaDosis = 'No Requiere'
      }
      this.vacunasService.updateVacuna(this.idVacunaEditando!, this.vacunaSeguimiento).then(() => {
        this.cerrarFormulario();
        this.mostrarFormularioNotificacion = true;
        this.mensajeCreacionEdicion = 'Vacuna actualizada con éxito!';
        setTimeout(() => {
          this.mostrarFormularioNotificacion = false;
        }, 2000);
      });
    } else {
      // Crear nueva vacuna
      this.vacunaSeguimiento.IdExpediente = this.idExpediente!;
      this.vacunaSeguimiento.IdMascota = this.idMascota!;
      if (this.vacunaSeguimiento.fechaProximaDosis?.trim() === '') {
        this.vacunaSeguimiento.fechaProximaDosis = 'No Requiere'
      }
      this.vacunasService.createVacuna(this.vacunaSeguimiento).then(() => {
        this.cerrarFormulario();
        this.mostrarFormularioNotificacion = true;
        this.mensajeCreacionEdicion = 'Vacuna agregada con éxito!';
        setTimeout(() => {
          this.mostrarFormularioNotificacion = false;
        }, 2000);
      });
    }
  } // fin guardarVacuna

  volverAtras(): void {
    this.location.back(); // Navega a la página anterior
  }

  abrirFormulario() {
    this.mostrarFormulario = true;

    this.vacunaSeguimiento = {
      IdMascota: '',
      IdExpediente: '',
      tipoVacuna: '',
      fechaAplicacion: '',
      fechaProximaDosis: '',
      observaciones: '',
      estado: 'programada',
      usuarioResponsable: '',
      fechaUltimaModificacion: this.obterFechaActual(),
    } // Limpiar el objeto


  }


  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idVacunaEditando = null;
    this.vacunaSeguimiento = {
      IdMascota: '',
      IdExpediente: '',
      tipoVacuna: '',
      fechaAplicacion: '',
      fechaProximaDosis: '',
      observaciones: '',
      estado: 'programada',
      usuarioResponsable: '',
      fechaUltimaModificacion: '',
    }
  }

  obterFechaActual(): string {
    // colocar la fecha actual en formato d/m/aaaa
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    const fechaActual = `${dia}/${mes}/${anio}`;

    return fechaActual;
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

} // fin class
