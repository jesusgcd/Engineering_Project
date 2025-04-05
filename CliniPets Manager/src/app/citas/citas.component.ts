import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas.service';
import { Cita } from '../models/citas.model';
import { map } from 'rxjs/operators';
import { Especialista } from '../models/especialista.model';
import { Sala } from '../models/salas.model';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
  standalone: false,
})
export class CitasComponent implements OnInit {
  cita: Cita = { nombre: '', telefono: '', fecha: '', hora: '', descripcion: '' , sala: '', especialista: ''};

  citas: Cita[] = [];
  filtro: string = '';
  filtroNombre: string = '';
  filtroFecha: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false;
  citaId: string | null = null;

  especialistas: Especialista[] = [];
  salas: Sala[] = [];

  citaAEliminarId: string | null = null;
  mostrarModal: boolean = false;
  modalEliminarMessage: string = '';
  mostrarModalchoque: boolean = false;
  modalMensaje: string = '';


  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.citasService
      .obtenerCitas()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Cita),
          }))
        )
      )
      .subscribe(
        (citas: Cita[]) => {
          this.citas = citas;
        },
        (error) => {
          console.error('Error al obtener citas:', error);
        }
      );


    this.citasService
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
          console.error('Error al obtener especialistas:', error);
        }
      );

    // Obtener salas
    this.citasService
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
          console.error('Error al obtener salas:', error);
        }
      );
  }

  editarCita(cita: Cita) {
    this.cita = { ...cita };
    this.modoEdicion = true;
    this.citaId = cita.id || null;
    this.mostrarFormulario = true;
  }

  guardarCita() {
    // Validar disponibilidad antes de agregar o editar la cita
    if (!this.validarDisponibilidad()) {
      this.modalMensaje = 'Ya existe una cita para este horario en la misma sala o con el mismo especialista.';
      this.mostrarModalchoque = true;
      return;
    }

    if (this.modoEdicion) {

      if (this.citaId) {
        this.citasService
          .actualizarCita(this.citaId, this.cita)
          .then(() => {
            console.log('Cita actualizada con éxito');
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            console.error('Error al actualizar la cita:', error);
          });
      }
    } else {

      this.citasService.agregarCita(this.cita).then(() => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);
        this.cita = { nombre: '', telefono: '', fecha: '', hora: '', descripcion: '', sala: '', especialista: '' }; // Limpiar el formulario
        this.cerrarFormulario();
      });
    }
  }


  confirmarEliminacionCita(confirmar: boolean) {
    if (confirmar && this.citaAEliminarId) {
      this.citasService.eliminarCita(this.citaAEliminarId)
        .then(() => {
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.citas = this.citas.filter(c => c.id !== this.citaAEliminarId);
        })
        .catch((error) => {
          console.error('Error al eliminar la cita de Firestore:', error);
        });
    }
    this.mostrarModal = false;
  }

  // Función que realiza la eliminación de una cita
  eliminarCita(id: string) {
    this.citaAEliminarId = id;
    console.log('ID de la cita a eliminar:', id);
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar la cita?`;
    this.mostrarModal = true;
  }


  abrirFormulario() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.cita = { nombre: '', telefono: '', fecha: '', hora: '', descripcion: '', sala: '', especialista: '' }; // Limpiar campos
  }


  cerrarFormulario() {
    this.mostrarFormulario = false;
  }



obtenerNombreSala(idSala: number): string {
  const sala = this.salas.find(sala => sala.id === idSala.toString());
  return sala ? sala.nombre : 'No disponible';
}

obtenerNombreEspecialista(idEspecialista: number): string {
  const especialista = this.especialistas.find(especialista => especialista.id === idEspecialista.toString());
  return especialista ? especialista.nombre : 'No disponible';
}


esCitaDelDia(dia: string, cita: Cita): boolean {
  const fecha = new Date(cita.fecha);
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const diaCita = dias[fecha.getDay()];

  return diaCita === dia;
}


validarDisponibilidad(): boolean {

  const convertirHoraAMinutos = (hora: string): number => {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  };


  const duracionCita = 30;


  const inicioNuevaCita = convertirHoraAMinutos(this.cita.hora);
  const finNuevaCita = inicioNuevaCita + duracionCita;


  const citasFiltradas = this.citas.filter(cita => cita.id !== this.citaId);


  const citaConflictoSala = citasFiltradas.find(cita => {
    const inicioCitaExistente = convertirHoraAMinutos(cita.hora);
    const finCitaExistente = inicioCitaExistente + duracionCita;

    return (
      cita.sala === this.cita.sala &&
      this.cita.fecha === cita.fecha &&
      ((inicioNuevaCita < finCitaExistente && finNuevaCita > inicioCitaExistente))
    );
  });


  const citaConflictoEspecialista = citasFiltradas.find(cita => {
    const inicioCitaExistente = convertirHoraAMinutos(cita.hora);
    const finCitaExistente = inicioCitaExistente + duracionCita;


    return (
      cita.especialista === this.cita.especialista &&
      this.cita.fecha === cita.fecha &&
      ((inicioNuevaCita < finCitaExistente && finNuevaCita > inicioCitaExistente))
    );
  });


  if (citaConflictoSala || citaConflictoEspecialista) {
    return false;
  }

  return true;
}

get citasFiltradas(): Cita[] {
  return this.citas.filter(cita => {
    const nombreCoincide = cita.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
    const fechaCoincide = this.filtroFecha ? cita.fecha === this.filtroFecha : true;
    return nombreCoincide && fechaCoincide;
  });
}

limpiarFiltros() {
  this.filtroNombre = '';
  this.filtroFecha = '';
}

}


