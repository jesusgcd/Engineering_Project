import { Component, OnInit } from '@angular/core';
import { NotaSeguimiento } from '../models/notaSeguimiento.models';
import { NotasSeguimientoService } from '../services/notas-seguimiento.service';
import { ExpedienteDataService } from '../services/expediente-data.service';
import { Mascotas } from '../models/mascotas.models';
import { MascotasService } from '../services/mascotas.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notas-seguimiento',
  templateUrl: './notas-seguimiento.component.html',
  styleUrls: ['./notas-seguimiento.component.css'],
  standalone: false,
})
export class NotasSeguimientoComponent implements OnInit {
  idExpediente: string | null = null;
  idMascota: string | null = null;
  idNotaEditando: string | null = null;
  idNotaEliminar: string | null = null;

  mascota: Mascotas | null = null; // Información de la mascota
  notasSeguimiento: NotaSeguimiento[] = []; // Lista de notas
  notaSeguimiento: NotaSeguimiento = {
    IdMascota: '',
    IdExpediente: '',
    fechaCreacion: '',
    observaciones: '',
    estado: 'activa',
    usuarioCreador: '',
    fechaUltimaModificacion: '',
  };

  filtro: string = ''; // Filtro para la búsqueda
  mostrarFormulario: boolean = false; // Controla la visibilidad del formulario
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  mostrarFormularioNotificacion: boolean = false; // Controla la notificación
  mensaje: string | null = null; // Mensaje para mostrar en pantalla
  mensajeCreacionEdicion: string | null = null; // Mensaje de éxito
  esError: boolean = false; // Indica si el mensaje es un error
  modoEdicion: boolean = false; // Indica si se está en modo edición

  constructor(
    private expedienteDataService: ExpedienteDataService,
    private notasSeguimientoService: NotasSeguimientoService,
    private mascotasService: MascotasService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.idExpediente = this.expedienteDataService.getIdExpediente();
    this.idMascota = this.expedienteDataService.getIdMascota();

    if (this.idExpediente) {
      this.notasSeguimientoService.getNotasByExpediente(this.idExpediente).subscribe(
        (notas) => {
          this.notasSeguimiento = notas;
        },
        (error) => {
          console.error('Error al obtener las notas de seguimiento:', error);
        }
      );
    }

    if (this.idMascota) {
      this.mascotasService.obtenerMascotaPorId(this.idMascota).subscribe(
        (mascota) => {
          this.mascota = mascota || null;
        },
        (error) => {
          console.error('Error al obtener la mascota:', error);
        }
      );
    }
  }

  abrirFormulario(): void {

    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.notaSeguimiento = {
      IdMascota: this.idMascota!,
      IdExpediente: this.idExpediente!,
      fechaCreacion: '',
      observaciones: '',
      estado: 'activa',
      usuarioCreador: '',
      fechaUltimaModificacion: '',
    };
  }


  volverAtras(): void {
    this.location.back(); // Navega a la página anterior
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

  cerrarFormulario(): void {
    this.modoEdicion = false;
    this.mostrarFormulario = false;
    this.notaSeguimiento = {
      IdMascota: '',
      IdExpediente: '',
      fechaCreacion: '',
      observaciones: '',
      estado: 'activa',
      usuarioCreador: '',
      fechaUltimaModificacion: '',
    };
  }

  guardarNota(): void {
    if (!this.notaSeguimiento.observaciones.trim() || !this.notaSeguimiento.usuarioCreador.trim()) {
      this.mostrarMensaje('Todos los campos son requeridos', true);
      return;
    }

    if (this.modoEdicion) {
      this.notaSeguimiento.fechaUltimaModificacion = this.obterFechaActual();
      this.notasSeguimientoService
        .updateNota(this.idNotaEditando!, this.notaSeguimiento)
        .then(() => {
          this.mostrarNotificacion('Nota de seguimiento actualizada con éxito.');
          this.cerrarFormulario();
        })
        .catch((error) => {
          console.error('Error al actualizar la nota:', error);
        });
    } else {
      this.notaSeguimiento.fechaCreacion = this.obterFechaActual();
      this.notaSeguimiento.fechaUltimaModificacion = this.obterFechaActual();
      this.notasSeguimientoService
        .createNota(this.notaSeguimiento)
        .then(() => {
          this.mostrarNotificacion('Nota de seguimiento creada con éxito.');
          this.cerrarFormulario();
        })
        .catch((error) => {
          console.error('Error al crear la nota:', error);
        });
    }
  }

  editarNota(idNota: string, nota: NotaSeguimiento): void {
    this.modoEdicion = true;
    this.idNotaEditando = idNota;
    this.notaSeguimiento = { ...nota };
    this.mostrarFormulario = true;
  }

  eliminarNota(idNota: string): void {
    this.idNotaEliminar = idNota;
    this.mostrarModal = true;
  }

  confirmarEliminacion(confirmar: boolean): void {
    if (confirmar && this.idNotaEliminar) {
      this.notasSeguimientoService
        .deleteNota(this.idNotaEliminar)
        .catch((error) => {
          console.error('Error al eliminar la nota:', error);
        });
    }
    this.mostrarModal = false;
    this.idNotaEliminar = null;
  }

  mostrarMensaje(mensaje: string, esError: boolean): void {
    this.mensaje = mensaje;
    this.esError = esError;
    setTimeout(() => {
      this.mensaje = null;
    }, 3000);
  }

  mostrarNotificacion(mensaje: string): void {
    this.mensajeCreacionEdicion = mensaje;
    this.mostrarFormularioNotificacion = true;
    setTimeout(() => {
      this.mostrarFormularioNotificacion = false;
    }, 2000);
  }
}
