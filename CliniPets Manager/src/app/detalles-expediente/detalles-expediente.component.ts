import { Component, OnInit } from '@angular/core';
import { ExpedienteDataService } from '../services/expediente-data.service';
import { Mascotas } from '../models/mascotas.models';
import { Expediente } from '../models/expediente.model';
import { MascotasService } from '../services/mascotas.service';
import { ExpedientesService } from '../services/expedientes.service';
import { Router } from '@angular/router';
import { HojasInternamientoService } from '../services/hojas-internamiento.service';
import { HojaInternamiento } from '../models/hojaInternamiento.models';
import { NotasSeguimientoService } from '../services/notas-seguimiento.service';
import { NotaSeguimiento } from '../models/notaSeguimiento.models';
import { InformesMedicosService } from '../services/informes-medicos.service';
import { InformeMedico } from '../models/informeMedico.model';
import { SeguimientoVacunas } from '../models/seguimientoVacunas.model';
import { SeguimientoVacunasService } from '../services/seguimiento-vacunas.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-detalles-expediente',
  templateUrl: './detalles-expediente.component.html',
  styleUrls: ['./detalles-expediente.component.css'],
  standalone: false,
})
export class DetallesExpedienteComponent implements OnInit {
  idExpediente: string | null = null;
  idMascota: string | null = null;


  expediente: Expediente | null = null; // Variable para almacenar el expediente
  mascota: Mascotas | null = null; // Variable para almacenar la mascota
  mostrarFormulario = false; // Variable para mostrar el formulario de creación de hojas de internamiento
  //

  hojaInternamientos: HojaInternamiento[] = [];
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

  vacunasSeguimiento: SeguimientoVacunas[] = [];
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


  //



  constructor(
    private expedienteDataService: ExpedienteDataService,
    private router: Router,
    private informesMedicosService: InformesMedicosService,
    private expedientesService: ExpedientesService,
    private hojasInternamientoService: HojasInternamientoService,
    private mascotasService: MascotasService,
    private vacunasService: SeguimientoVacunasService,
    private notasSeguimientoService: NotasSeguimientoService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.idExpediente = this.expedienteDataService.getIdExpediente();
    this.idMascota = this.expedienteDataService.getIdMascota();

    // traer el expediente
    if (this.idExpediente) {
      this.expedientesService
        .obtenerExpedientePorId(this.idExpediente)
        .subscribe((expediente) => {
          if (expediente) {
            this.expediente = expediente;
          } else {
            this.expediente = null;
          }
        });
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

    // traer las hojas de internamiento
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

    // traer las notas
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

    // traer los informes
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


  } // fin metodo ngOnInit

  volverAtras(): void {
    this.location.back(); // Navega a la página anterior
  }


  gestionarHojasInternamiento(idExpedienteSource: string | null, idMascotaSource: string | null): void {
    if (idExpedienteSource && idMascotaSource) {
      this.expedienteDataService.changeIdExpediente(idExpedienteSource, idMascotaSource);
      this.router.navigate(['/hojas-internamiento']);
    } else {
      console.error('Los valores de idExpedienteSource o idMascotaSource son nulos');
      this.router.navigate(['/expedientes']);
    }
  }


  gestionarNotasSeguimiento(idExpedienteSource: string | null, idMascotaSource: string | null): void {

    if (idExpedienteSource && idMascotaSource) {
      this.expedienteDataService.changeIdExpediente(idExpedienteSource, idMascotaSource);
      this.router.navigate(['/notas-seguimiento']);
    } else {
      console.error('Los valores de idExpedienteSource o idMascotaSource son nulos');
      this.router.navigate(['/expedientes']);
    }
  }

  gestionarInformesMedicos(idExpedienteSource: string | null, idMascotaSource: string | null): void {

    if (idExpedienteSource && idMascotaSource) {
      this.expedienteDataService.changeIdExpediente(idExpedienteSource, idMascotaSource);
      this.router.navigate(['/informes-medicos']);
    } else {
      console.error('Los valores de idExpedienteSource o idMascotaSource son nulos');
      this.router.navigate(['/expedientes']);
    }
  }

  gestionarVacunas(idExpedienteSource: string | null, idMascotaSource: string | null): void {

    if (idExpedienteSource && idMascotaSource) {
      this.expedienteDataService.changeIdExpediente(idExpedienteSource, idMascotaSource);
      this.router.navigate(['/seguimiento-vacuna']);
    } else {
      console.error('Los valores de idExpedienteSource o idMascotaSource son nulos');
      this.router.navigate(['/expedientes']);
    }
  }


}
