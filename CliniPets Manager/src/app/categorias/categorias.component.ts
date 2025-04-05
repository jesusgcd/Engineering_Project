import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../services/categorias.service';
import { Categoria } from '../models/categoria.model';
import { Producto } from '../models/producto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from "../filter.pipe";

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  imports: [CommonModule, FormsModule, FilterPipe],
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  filtro: string = '';
  categoria: Categoria = { nombre: '', stock: 0 };
  categoriaId: string | null = null;
  mostrarProductos = false;
  categoriaSeleccionada: string = '';
  mensajeExito: string = '';
 // Variables para el modal de eliminacion
 mostrarModal: boolean = false;
 CategoriaAEliminarId: string | null = null;
// Variables de paginación
  Paginadas: Categoria[] = [];

   pageSize = 7;
   currentPage = 1;
   totalPages = 0;

   constructor(private categoriaService: CategoriaService) {}

   ngOnInit(): void {
    // Obtener categorías y productos
    this.categoriaService.obtenerCategorias().subscribe((categoriasData) => {
      const categoriasConId = categoriasData.map((e) => ({
        id: e.payload.doc.id,
        ...(e.payload.doc.data() as Categoria),
      }));

      this.categoriaService.obtenerTodosLosProductos().subscribe((productosData) => {
        const productos = productosData.map((e) => e.payload.doc.data() as Producto);

        // Crear un Set para identificar todas las categorías (existentes y nuevas)
        const categoriasUnicas = new Set<string>();

        // Agregar categorías existentes
        categoriasConId.forEach((categoria) => categoriasUnicas.add(categoria.nombre));

        // Agregar categorías derivadas de los productos
        productos.forEach((producto) => categoriasUnicas.add(producto.categoria));

        // Crear una lista final de categorías combinadas
        const categoriasFinal = Array.from(categoriasUnicas).map((nombre) => {
          const stock = productos
            .filter((p) => p.categoria === nombre) // Filtrar productos por categoría
            .reduce((sum, p) => sum + (p.stock || 0), 0); // Calcular el stock total

          return {
            nombre,
            stock,
            id: categoriasConId.find((c) => c.nombre === nombre)?.id || null, // Usar ID si existe en la colección `categorias`
          } as Categoria;
        });

        // Actualizar la lista de categorías
        this.categorias = categoriasFinal;

        // Calcular el total de páginas y actualizar la vista paginada
        this.totalPages = Math.ceil(this.categorias.length / this.pageSize);
        this.updatePaginadas();
      });

    });
  }

   updatePaginadas() {
     const startIndex = (this.currentPage - 1) * this.pageSize;
     const endIndex = startIndex + this.pageSize;
     this.Paginadas = this.categorias.slice(startIndex, endIndex);
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


  agregarCategoria() {
    // Validar que el nombre de la categoría no esté repetido
    const nombreExiste = this.categorias.some(
      (cat) => cat.nombre.toLowerCase() === this.categoria.nombre.toLowerCase().trim()
    );



    if (nombreExiste) {
      this.mostrarMensaje('La categoría ya existe. Por favor, verifica e intenta de nuevo.');
      return;
    }

    // Validar que todos los campos del formulario estén llenos
    if (!this.categoria.nombre.trim()) {
      this.mostrarMensaje('Por favor, completa todos los campos del formulario.');
      return;
    }

    if (this.modoEdicion && this.categoriaId) {
      // Actualizar categoría existente
      this.categoriaService.actualizarCategoria(this.categoriaId, this.categoria).then(() => {
        this.cerrarFormulario()
        this.mostrarMensaje('Categoría actualizada con éxito.');
      });
    } else {
      // Agregar nueva categoría
      this.categoria.stock = 0; // Stock inicial es 0
      this.categoriaService.agregarCategoria(this.categoria).then(() => {
        this.cerrarFormulario()
        this.mostrarMensaje('Categoría registrada con éxito.');
      });
    }
  }

  editarCategoria(categoria: Categoria) {
    this.categoria = { ...categoria };
    this.categoriaId = categoria.id || null;
    this.modoEdicion = true;
    this.mostrarFormulario = true;
  }

    // Método para abrir el modal de confirmación
    eliminarCategoria(id: string) {
      this.mostrarModal = true;
      this.CategoriaAEliminarId = id;
    }

    confirmarEliminacion(confirmado: boolean) {
      if (confirmado && this.CategoriaAEliminarId) {
        const categoriaAEliminar = this.categorias.find((cat) => cat.id === this.CategoriaAEliminarId);
    
        // Verificar si la categoría tiene stock cero
        if (categoriaAEliminar && categoriaAEliminar.stock === 0) {
          // Si el stock es cero, proceder con la eliminación
          this.categoriaService
            .eliminarCategoria(this.CategoriaAEliminarId)
            .then(() => {
              this.mostrarMensaje('Categoría eliminada con éxito');
              this.updatePaginadas();  // Actualizar la vista de categorías paginadas
            })
            .catch((error) => {
              console.error('Error al eliminar la categoría: ', error);
            });
        } else {
          // Si el stock no es cero, mostrar un mensaje de advertencia
          this.mostrarMensaje('No se puede eliminar la categoría porque tiene stock disponible.');
        }
      }
      this.cerrarModal(); // Cierra el modal en ambos casos
    }
    

    // Método para cerrar el modal
    cerrarModal() {
      this.mostrarModal = false;
      this.CategoriaAEliminarId = null;
    }



  verProductos(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.categoriaService.obtenerProductosPorCategoria(categoria).subscribe((data) => {
      this.productos = data.map((e) => e.payload.doc.data() as Producto);
      this.mostrarProductos = true;
    });
  }

  cerrarProductos() {
    this.mostrarProductos = false;
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

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.categoria = { nombre: '', stock: 0 };
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.categoriaId = null;
  }
}
