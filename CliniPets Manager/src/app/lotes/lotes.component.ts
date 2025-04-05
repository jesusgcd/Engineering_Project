import { Component, OnInit } from '@angular/core';
import { LotesService } from '../services/lotes.service';
import { MovimientoService } from '../services/movimiento.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from "../filter.pipe";
import { Lote } from '../models/lotes.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css'],
  imports: [CommonModule, FormsModule, FilterPipe],
})
export class LotesComponent implements OnInit {
  lote: Lote = {
    codigo: '',
    nombre: '',
    stock: 0,
    fechaIngreso: '',
    fechaVencimiento: '',
    proveedor: '',
  };

  lotes: Lote[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  modoEdicion: boolean = false;
  loteId: string | null = null;

  // Variables para el modal de eliminación
  mostrarModal: boolean = false;
  loteAEliminarId: string | null = null;
  // Variables de paginación
  Paginadas: Lote[] = [];
  pageSize = 7;
  currentPage = 1;
  totalPages = 0;
  constructor(
    private lotesService: LotesService,
    private movimientoService: MovimientoService
  ) {}


  ngOnInit(): void {
    this.lotesService // Cambiado a 'this.lotesService'
      .obtenerLotes() // Método del servicio para obtener lotes
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Lote),
          }))
        )
      )
      .subscribe(
        (lotes: Lote[]) => {
          this.lotes = lotes; // Asignar los lotes obtenidos
          this.totalPages = Math.ceil(this.lotes.length / this.pageSize);
          this.updatePaginadas();
        },
        (error) => {
          console.error('Error al obtener lotes:', error);
        }
      );
  }
updatePaginadas() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.Paginadas = this.lotes.slice(startIndex, endIndex);
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
  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.lote = {
      codigo: '',
      nombre: '',
      stock: 0,
      fechaIngreso: '',
      fechaVencimiento: '',
      proveedor: '',
    };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.loteId = null;
  }
  agregarLote(): void {
      // Verificar que todos los campos estén llenos
      if (!this.lote.codigo || !this.lote.nombre || !this.lote.stock|| !this.lote.fechaIngreso|| !this.lote.fechaVencimiento|| !this.lote.proveedor) {
        this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
        return;
      }
    if (this.modoEdicion) {
      // Editar lote existente
      if (this.loteId) {
        this.lotesService.actualizarLote(this.loteId, this.lote)
          .then(() => {
            this.cerrarFormulario()
            this.mostrarMensaje('Lote actualizado con éxito');

           // Registrar movimiento
            this.movimientoService.agregarMovimiento({
              codigo: this.lote.codigo,
              nombre: this.lote.nombre || 'Lote sin nombre',
              descripcion: 'Lote actualizado',
              fecha: new Date().toISOString(),
            });


          })
          .catch((error) => {
            console.error('Error al actualizar el lote:', error);
          });
      }
    } else {
      // Verificar si el código ya existe
      const codigoExiste = this.lotes.some(
        (l) => l.codigo.toLowerCase() === this.lote.codigo.toLowerCase()
      );

      if (codigoExiste) {
        this.mostrarMensaje('El código ya existe. Verifica e intenta de nuevo.');
        return;
      }

      // Agregar nuevo lote
      this.lotesService
        .agregarLote(this.lote)
        .then(() => {
          this.cerrarFormulario()
          this.mostrarMensaje('Lote agregado con éxito');

          // Registrar movimiento
          this.movimientoService.agregarMovimiento({
            codigo: this.lote.codigo,
            nombre: this.lote.nombre || 'Lote sin nombre',
            descripcion: 'Nuevo lote agregado',
            fecha: new Date().toISOString(),
          });

        })
        .catch((error) => {
          console.error('Error al agregar el lote:', error);
        });
    }
  }

  editarLote(lote: Lote): void {
    this.lote = { ...lote };
    this.modoEdicion = true;
    this.loteId = lote.id || null;
    this.mostrarFormulario = true;
  }

  eliminarLote(id: string): void {
    this.mostrarModal = true;
    this.loteAEliminarId = id;
  }

  confirmarEliminacion(confirmado: boolean): void {
    if (confirmado && this.loteAEliminarId) {
      const loteAEliminar = this.lotes.find((l) => l.id === this.loteAEliminarId);

      if (!loteAEliminar) {
        this.mostrarMensaje('Error: Lote no encontrado');
        return;
      }

      this.lotesService.eliminarLote(this.loteAEliminarId).then(() => {
        this.mostrarMensaje('Lote eliminado con éxito');
         // Registrar movimiento solo si se elimina correctamente
         this.movimientoService.agregarMovimiento({
          codigo: loteAEliminar.codigo,
          nombre: loteAEliminar.nombre,
          descripcion: 'Lote eliminado',
          fecha: new Date().toISOString(),
        });
      });
    }

    this.cerrarModal()
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.loteAEliminarId = null;
  }

  actualizarStock(id: string, nuevoStock: number){
    const lote = this.lotes.find((l) => l.id === id);

    if (lote) {
      // Actualiza en Firestore
      this.lotesService.actualizarStock(id, nuevoStock).then(() => {

         // Registrar movimiento
         this.movimientoService.agregarMovimiento({
          codigo: lote.codigo,
          nombre: lote.nombre,
          descripcion: `Stock actualizado a ${nuevoStock}`,
          fecha: new Date().toISOString(),
        });
      }).catch(error => {
        console.error('Error al actualizar el stock:', error);
      });
    }
  }

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
