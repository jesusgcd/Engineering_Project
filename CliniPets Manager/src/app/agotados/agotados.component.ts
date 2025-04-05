import { Component, OnInit } from '@angular/core';
import { AgotadosService } from '../services/agotados.service';
import { Agotado } from '../models/agotado.model';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from "../filter.pipe";

@Component({
  selector: 'app-agotados',
  templateUrl: './agotados.component.html',
  styleUrl: './agotados.component.css',
  imports: [CommonModule, FormsModule, FilterPipe],
})
export class AgotadosComponent implements OnInit {
  productosAgotados: Agotado[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  modoEdicion: boolean = false;
  producto: Agotado = { codigo: '', nombre: '', stock: 0, categoria: '' };
  productoId: string | null = null;

  mostrarModal: boolean = false;
  productoAEliminarId: string | null = null;

 // Variables de paginación
  Paginadas: Agotado[] = [];

   pageSize = 7;
   currentPage = 1;
   totalPages = 0;

  constructor(private AgotadosService: AgotadosService) {}

  ngOnInit(): void {
    this.cargarProductosAgotados();
  }

  cargarProductosAgotados() {
    this.AgotadosService
      .obtenerProductosAgotados()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Agotado),
          }))
        )
      )
      .subscribe((productos: Agotado[]) => {
          this.productosAgotados = productos;
          this.totalPages = Math.ceil(this.productosAgotados.length / this.pageSize);
          this.updatePaginadas();

        },
        (error: any) => {
          console.error('Error al cargar productos agotados:', error);
        }
      );

  }

updatePaginadas() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.Paginadas = this.productosAgotados.slice(startIndex, endIndex);
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

  abrirFormulario() {
    this.modoEdicion = false;
    this.mostrarFormulario = true;
    this.producto = { codigo: '', nombre: '', stock: 0, categoria: '' };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.productoId = null;
  }

  guardarProductoAgotado() {
    const codigoExiste = this.productosAgotados.some(
      (prod) => prod.codigo.toLowerCase() === this.producto.codigo.toLowerCase()
    );

      // Verificar que todos los campos estén llenos
    if (!this.producto.codigo || !this.producto.nombre || !this.producto.categoria) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }
    if (!this.modoEdicion) {
      // Verificar si el código ya existe al agregar
      if (codigoExiste) {
        this.mostrarMensaje('El código ya existe. Por favor, verifica e intenta de nuevo.');
        return;
      }

      // Agregar nuevo producto
      this.AgotadosService.agregarProductoAgotado(this.producto).then(() => {
          this.cerrarFormulario()
          this.mostrarMensaje('Producto agregado con éxito')})
    } else {
      // Editar producto existente
      if (this.productoId) {
        // Verificar si el código ya existe al actualizar, excluyendo el producto actual
        const codigoDuplicado = this.productosAgotados.some(
          (prod) =>
            prod.codigo.toLowerCase() === this.producto.codigo.toLowerCase() &&
            prod.id !== this.productoId
        );

        if (codigoDuplicado) {
          this.mostrarMensaje('El código ya existe. Por favor, verifica e intenta de nuevo.');
          return;
        }

        this.AgotadosService.actualizarProductoAgotado(this.productoId, this.producto).then(() =>{
          this.cerrarFormulario()
          this.mostrarMensaje('Producto actualizado con éxito')})

      }
    }
  }


  editarProducto(producto: Agotado) {
    this.producto = { ...producto };
    this.productoId = producto.id || null;
    this.modoEdicion = true;
    this.mostrarFormulario = true;
  }

  eliminarProducto(id: string) {
    this.mostrarModal = true;
    this.productoAEliminarId = id;
  }

  confirmarEliminacion(confirmado: boolean) {
    if (confirmado && this.productoAEliminarId) {
      this.AgotadosService
        .eliminarProductoAgotado(this.productoAEliminarId)
        .then(() => {
          this.mostrarMensaje('Producto eliminado con éxito',false);
        })
        .catch((error) => {
          console.error('Error al eliminar producto:', error);
        });
    }
    this.cerrarModal();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.productoAEliminarId = null;
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
