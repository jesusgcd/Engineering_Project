import { Component, OnInit } from '@angular/core';
import { Especialista } from '../models/especialista.model';
import { EspecialistaService } from '../services/especialista.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-especialistas',
  templateUrl: './especialistas.component.html',
  styleUrls: ['./especialistas.component.css'],
  standalone: false,
})
export class EspecialistasComponent implements OnInit {
  especialista: Especialista = { nombre: '', especialidad: '', correo: '', telefono: '' };
  especialistas: Especialista[] = [];
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false;
  especialistaId: string | null = null;

  especialistaAEliminarId: string | null = null;
  mostrarModal: boolean = false;
  mostrarModalcorreo: boolean = false;
  modalMensaje: string = '';
  modalEliminarMessage: string = '';

  constructor(private especialistaService: EspecialistaService) {}

  ngOnInit(): void {
    this.especialistaService
      .obtenerEspecialistas()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Especialista),
          }))
        )
      )
      .subscribe(
        (especialistas: Especialista[]) => {
          this.especialistas = especialistas;
        },
        (error) => {
          console.error('Error al obtener los especialistas:', error);
        }
      );
  }

  guardarEspecialista() {
    if (!this.validateEmail(this.especialista.correo)) {
      // Mostrar el modal en lugar de alert
      this.modalMensaje = 'El correo electrónico ingresado no es válido.';
      this.mostrarModalcorreo = true;
      return;
    }

    if (this.modoEdicion) {
      if (this.especialistaId) {
        this.especialistaService.actualizarEspecialista(this.especialistaId, this.especialista).then(() => {
          this.mensajeExito = true;
          setTimeout(() => (this.mensajeExito = false), 3000);
          this.cerrarFormulario();
        });
      }
    } else {
      this.especialistaService.agregarEspecialista(this.especialista).then(() => {
        this.mensajeExito = true;
        setTimeout(() => (this.mensajeExito = false), 3000);
        this.especialista = { nombre: '', especialidad: '', correo: '', telefono: '' };
        this.cerrarFormulario();
      });
    }
  }

  editarEspecialista(especialista: Especialista) {
    this.especialista = { ...especialista };
    this.modoEdicion = true;
    this.especialistaId = especialista.id || null;
    this.mostrarFormulario = true;
  }

  confirmarEliminacionEspecialista(confirmar: boolean) {
    if (confirmar && this.especialistaAEliminarId) {
      this.especialistaService.eliminarEspecialista(this.especialistaAEliminarId)
        .then(() => {

          this.especialistas = this.especialistas.filter(c => c.id !== this.especialistaAEliminarId);
        })
        .catch((error) => {
          console.error('Error al eliminar el especialista de Firestore:', error);
        });
    }
    this.mostrarModal = false;
  }


  eliminarEspecialista(id: string) {
    this.especialistaAEliminarId = id;
    console.log('ID del especialista a eliminar:', id);
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar el especialista? Pueden haber citas asociadas a este especialista.`;
    this.mostrarModal = true;
  }
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.especialista = { nombre: '', especialidad: '', correo: '', telefono: '' };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|es|co|edu)$/i;
    return emailRegex.test(email);
  }

}
