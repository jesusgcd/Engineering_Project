import { Component, OnInit } from '@angular/core';
import { Sala } from '../models/salas.model';
import { SalasService } from '../services/salas.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html',
  styleUrls: ['./salas.component.css'],
  standalone: false,
})
export class SalasComponent implements OnInit {
  sala: Sala = { nombre: '', ubicacion: '', capacidad: 0 };
  salas: Sala[] = [];
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false;
  salaId: string | null = null;


  salaAEliminarId: string | null = null;
  mostrarModal: boolean = false;
  modalEliminarMessage: string = '';

  constructor(private salasService: SalasService) {}

  ngOnInit(): void {
    this.salasService
      .obtenerSalas()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Sala),
          }))
        )
      )
      .subscribe(
        (salas: Sala[]) => {
          this.salas = salas;
        },
        (error) => {
          console.error('Error al obtener las salas:', error);
        }
      );
  }

  agregarSala() {
    if (this.modoEdicion) {
      if (this.salaId) {
        this.salasService.actualizarSala(this.salaId, this.sala).then(() => {
          this.mensajeExito = true;
          setTimeout(() => (this.mensajeExito = false), 3000);
          this.cerrarFormulario();
        });
      }
    } else {
      this.salasService.agregarSala(this.sala).then(() => {
        this.mensajeExito = true;
        setTimeout(() => (this.mensajeExito = false), 3000);
        this.sala = { nombre: '', ubicacion: '', capacidad: 0 };
        this.cerrarFormulario();
      });
    }
  }

  editarSala(sala: Sala) {
    this.sala = { ...sala };
    this.modoEdicion = true;
    this.salaId = sala.id || null;
    this.mostrarFormulario = true;
  }

  confirmarEliminacionCita(confirmar: boolean) {
    if (confirmar && this.salaAEliminarId) {
      this.salasService.eliminarSala(this.salaAEliminarId)
        .then(() => {

          this.salas = this.salas.filter(c => c.id !== this.salaAEliminarId);
        })
        .catch((error) => {
          console.error('Error al eliminar la sala de Firestore:', error);
        });
    }
    this.mostrarModal = false;
  }


  eliminarSala(id: string) {
    this.salaAEliminarId = id;
    console.log('ID de la sala a eliminar:', id);
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar la sala? Pueden haber citas asociadas a esta sala.`;
    this.mostrarModal = true;
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.sala = { nombre: '', ubicacion: '', capacidad: 0 };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
  }
}
