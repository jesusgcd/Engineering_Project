import { Component, OnInit } from '@angular/core';
import { MovimientoService } from '../services/movimiento.service';
import { Movimiento } from '../models/movimientos.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from "../filter.pipe";

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  imports: [CommonModule, FormsModule, FilterPipe],
})
export class MovimientosComponent implements OnInit {
  movimientos: Movimiento[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  movimientoActual: Movimiento = { codigo: '', nombre: '', descripcion: '', fecha: undefined };
  mensajeExito: string = '';

  mostrarModal: boolean = false;
  movimientoAEliminarId: string | null = null;
// Variables de paginación
  Paginadas: Movimiento[] = [];

   pageSize = 7;
   currentPage = 1;
   totalPages = 0;
  constructor(private movimientoService: MovimientoService) {}

  ngOnInit(): void {
    this.movimientoService.obtenerMovimientos().subscribe(
      (data) => {
        this.movimientos = data.map(doc => {
          const movimiento = doc.payload.doc.data() as Movimiento;
          return {
            id: doc.payload.doc.id,
            ...movimiento
          };
        });
        // Calcular el total de páginas y actualizar la vista paginada
      this.totalPages = Math.ceil(this.movimientos.length / this.pageSize);
      this.updatePaginadas();
      },
      (error) => console.error('Error al obtener movimientos:', error)
    );

  }
  updatePaginadas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.Paginadas = this.movimientos.slice(startIndex, endIndex);
  }

  // Cambia la página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginadas();
    }
  }

  // Avanza a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginadas();
    }
  }

  // Retrocede a la página anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginadas();
    }
  }

  movimientosFiltrados(): Movimiento[] {
    return this.movimientos.filter((mov) =>
      mov.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  abrirFormulario(movimiento?: Movimiento) {
    this.modoEdicion = !!movimiento;
    this.movimientoActual = movimiento
      ? { ...movimiento }
      : { codigo: '', nombre: '', descripcion: '', fecha: new Date().toISOString() };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(){
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.movimientoAEliminarId = null;
  }

  guardarMovimiento() {
    // Validar si el código del movimiento ya existe al agregar o editar
    const codigoExiste = this.movimientos.some(
      (mov) => mov.codigo.toLowerCase() === this.movimientoActual.codigo.toLowerCase() && mov.id !== this.movimientoActual.id
    );
      // Verificar que todos los campos estén llenos
    if (!this.movimientoActual.codigo || !this.movimientoActual.nombre || !this.movimientoActual.descripcion) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }
    // Asignar la fecha actual con hora
    this.movimientoActual.fecha = new Date().toISOString();

    if (this.modoEdicion && this.movimientoActual.id) {
      this.movimientoService
        .actualizarMovimiento(this.movimientoActual.id, this.movimientoActual)
        .then(() => {
          this.cerrarFormulario()
          this.mostrarMensaje('Movimiento actualizado con éxito')})
        .catch((error) => console.error('Error al actualizar movimiento:', error));
    } else {

      if (codigoExiste) {
        this.mostrarMensaje('El código ya existe. Por favor, verifica e intenta de nuevo.');
        return;
      }

      this.movimientoService
        .agregarMovimiento(this.movimientoActual)

        .then(() => {

            this.cerrarFormulario()
          this.mostrarMensaje('Movimiento agregado con éxito')})
        .catch((error) => console.error('Error al agregar movimiento:', error));
    }
  }


  eliminarMovimiento(id: string) {
    this.mostrarModal = true;
    this.movimientoAEliminarId = id;
  }

  confirmarEliminacion(confirmado: boolean){
    if (confirmado && this.movimientoAEliminarId) {
      this.movimientoService
        .eliminarMovimiento(this.movimientoAEliminarId)
        .then(() =>
          this.mostrarMensaje('Movimiento eliminado con éxito'))
        .catch((error) => console.error('Error al eliminar movimiento:', error));
    }

      this.cerrarModal();

  }

  cerrarModal(){
    this.mostrarModal = false;
    this.movimientoAEliminarId = null;

  }

  // Mostrar mensaje de éxito con cierre automático
  mostrarMensaje(mensaje: string, cerrarFormulario: boolean=false, callback?: () => void) {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = '';

      if (cerrarFormulario && callback) {
        callback();
        this.cerrarFormulario();
      }

    }, 2000);
  }
}
