import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InformesMedicosService } from '../services/informes-medicos.service';
import { InformeMedico } from '../models/informeMedico.model';
import { MascotasService } from '../services/mascotas.service';
import { Mascotas } from '../models/mascotas.models';
import { ExpedienteDataService } from '../services/expediente-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-informes-medicos',
  templateUrl: './informes-medicos.component.html',
  styleUrls: ['./informes-medicos.component.css'],
  standalone: false,
})
export class InformesMedicosComponent {
  idMascota: string | null = null;
  idInformeEditando: string | null = null;
  idInformeEliminar: string | null = null;

  mascota: Mascotas | null = null;
  mensaje: string | null = null;
  esError: boolean = false;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  idExpediente: string | null = null;
  mensajeCreacionEdicion: string | null = null;
  mostrarFormularioNotificacion: boolean = false;
  filtro: string = '';
  mostrarModal: boolean = false;

  informesMedicos: InformeMedico[] = [];
  informeMedico: InformeMedico = {
    idMascota: '',
    idExpediente: '',
    fechaCreacion: '',
    diagnosticos: '',
    tratamientos: '',
    observaciones: '',
    estado: 'activo',
    usuarioCreador: '',
  };



  constructor(
    private informesMedicosService: InformesMedicosService,
    private mascotasService: MascotasService,
    private expedienteDataService: ExpedienteDataService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.idExpediente = this.expedienteDataService.getIdExpediente();
    this.idMascota = this.expedienteDataService.getIdMascota();

    if (this.idExpediente) {
      this.informesMedicosService.getInformesByExpediente(this.idExpediente).subscribe(
        (informes) => {
          this.informesMedicos = informes; // Aquí cada informe incluye `id`
          console.log(this.informesMedicos); // Verifica que cada objeto tiene `id`
        },
        (error) => {
          console.error('Error al obtener los informes:', error);
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


  } // fin ngOnInit

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.informeMedico = {
      idMascota: this.idMascota!,
      idExpediente: '',
      fechaCreacion: '',
      diagnosticos: '',
      tratamientos: '',
      observaciones: '',
      estado: 'activo',
      usuarioCreador: '',
    };
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
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idInformeEditando = null;
    this.informeMedico = {
      idMascota: '',
      idExpediente: '',
      fechaCreacion: '',
      diagnosticos: '',
      tratamientos: '',
      observaciones: '',
      estado: 'activo',
      usuarioCreador: '',
    };
  }

  volverAtras(): void {
    this.location.back(); // Navega a la página anterior
  }

  guardarInforme(): void {
    if (
      !this.informeMedico.diagnosticos ||
      !this.informeMedico.tratamientos ||
      !this.informeMedico.usuarioCreador
    ) {
      this.mensaje = 'Todos los campos son obligatorios';
      this.esError = true;
      return;
    }

    if (this.modoEdicion) {
      this.informeMedico.fechaUltimaModificacion = this.obterFechaActual();
      this.informesMedicosService
        .updateInforme(this.idInformeEditando!, this.informeMedico)
        .then(() => this.cerrarFormulario());
    } else {
      this.informeMedico.fechaCreacion = this.obterFechaActual();
      this.informeMedico.fechaUltimaModificacion = this.obterFechaActual();
      this.informeMedico.idExpediente = this.idExpediente!;
      this.informesMedicosService
        .createInforme(this.informeMedico)
        .then(() => this.cerrarFormulario());
    }
  }

  editarInforme(id: string, informe: InformeMedico): void {
    this.modoEdicion = true;
    this.idInformeEditando = id;
    this.mostrarFormulario = true;
    this.informeMedico = { ...informe };
  }

  eliminarInforme(id: string): void {
    this.idInformeEliminar = id;
    this.mostrarModal = true;
  }

  // Procesar la confirmación en el modal
  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.idInformeEliminar) {
      this.informesMedicosService
        .deleteInforme(this.idInformeEliminar)
        .catch((error) => {
          console.error('Error al eliminar la nota:', error);
        });
    }
    this.mostrarModal = false;
    this.idInformeEliminar = null;
  }
}
