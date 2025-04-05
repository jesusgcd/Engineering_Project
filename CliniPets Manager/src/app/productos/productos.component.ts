import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../models/producto.model';
import { map } from 'rxjs/operators';
import { MovimientoService } from '../services/movimiento.service';
import { CategoriaService } from '../services/categorias.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: false,
})
export class ProductosComponent implements OnInit {
  producto: Producto = { codigo: '', nombre: '', stock: 0, categoria: '' };
  categorias: string[] = []; // Lista de categorías disponibles
  productos: Producto[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';
  modoEdicion: boolean = false; 
  productoId: string | null = null; 

  // Variables para el modal de eliminacion
  mostrarModal: boolean = false;
  productoAEliminarId: string | null = null; // ID del producto a eliminar

  // Variables de paginación
  Paginadas: Producto[] = []; 
  pageSize = 7; 
  currentPage = 1; 
  totalPages = 0; 
  CategoriaService: any;
  
  constructor(private productosService: ProductosService,private movimientoService: MovimientoService, private categoriaService: CategoriaService
  ) {}
  ngOnInit(): void {
    this.productosService
      .obtenerProductos()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Producto),
          })))
      )
      .subscribe(
        (productos: Producto[]) => {
          this.productos = productos;
          this.totalPages = Math.ceil(this.productos.length / this.pageSize); 
          this.updatePaginadas();
        },
        (error) => {
          console.error('Error al obtener productos:', error);
        }
      );
      this.obtenerCategorias();
  }
  obtenerCategorias() {
    this.categoriaService.obtenerCategorias()
      .pipe(
        map((data) => 
          data.map((e) => {
            const categoriaData = e.payload.doc.data() as { nombre: string };
            return categoriaData.nombre; // Extraer solo el nombre
          })
        )
      )
      .subscribe(
        (categorias: string[]) => {
          this.categorias = categorias; // Asignar solo los nombres de las categorías
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
  }
  
  
  updatePaginadas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.Paginadas = this.productos.slice(startIndex, endIndex);
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
    // Método para abrir el modal de confirmación
    eliminarProducto(id: string) {
      this.mostrarModal = true;
      this.productoAEliminarId = id;
    }
  
    confirmarEliminacion(confirmado: boolean) {
      if (confirmado && this.productoAEliminarId) {
        // Buscar el producto antes de eliminar para obtener sus datos
        const productoAEliminar = this.productos.find(
          (p) => p.id === this.productoAEliminarId
        );
    
        if (!productoAEliminar) {
          console.error('Producto no encontrado para eliminar');
          this.mostrarMensaje('Error: Producto no encontrado');
          return;
        }
    
        // Eliminar el producto
        this.productosService
          .eliminarProducto(this.productoAEliminarId)
          .then(() => {
            this.mostrarMensaje('Producto eliminado con éxito');
           
            // Registrar movimiento solo si se elimina correctamente
            this.movimientoService.agregarMovimiento({
              codigo: productoAEliminar.codigo,
              nombre: productoAEliminar.nombre,
              descripcion: 'Producto eliminado',
              fecha: new Date().toISOString(),
            });
    
            
          })
          .catch((error) => {
            console.error('Error al eliminar el producto: ', error);
            this.mostrarMensaje('Error al eliminar el producto. Inténtalo de nuevo.');
          });
      }

        this.cerrarModal();
     
    }
    // Método para cerrar el modal
    cerrarModal() {
      this.mostrarModal = false;
      this.productoAEliminarId = null;
    }
  

  editarProducto(producto: Producto) {
    this.producto = { ...producto }; // Copiar los datos del producto seleccionado
    this.modoEdicion = true; // Activar modo edición
    this.productoId = producto.id || null; // Guardar el ID del producto
    this.mostrarFormulario = true; // Mostrar el formulario emergente
  }

  agregarProducto() {
    // Verificar que todos los campos estén llenos
    if (!this.producto.codigo || !this.producto.nombre || !this.producto.stock) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }
    if (this.modoEdicion) {
      // Editar producto existente
      if (this.productoId) {
        this.productosService
          .actualizarProducto(this.productoId, this.producto)
          .then(() => {
            this.cerrarFormulario()
            this.mostrarMensaje('Producto actualizado con éxito');
            // Registrar movimiento
            this.movimientoService.agregarMovimiento({
              codigo: this.producto.codigo,
              nombre: this.producto.nombre,
              descripcion: 'Producto actualizado',
              fecha: new Date().toISOString(),
            });
          })
          .catch((error) => {
            console.error('Error al actualizar el producto:', error);
          });
      }
    } else {
      // Agregar nuevo producto
      const codigoExiste = this.productos.some(
        (prod) => prod.codigo.toLowerCase() === this.producto.codigo.toLowerCase()
      );
  
      if (codigoExiste) {
        this.mostrarMensaje('El código ya existe. Por favor, verifica e intenta de nuevo.');
        return;
      }
  
      this.productosService
        .agregarProducto(this.producto)
        .then(() => {
          
          this.cerrarFormulario()
          this.mostrarMensaje('Producto agregado con éxito');
                // Registrar movimiento
                this.movimientoService.agregarMovimiento({
                  codigo: this.producto.codigo,
                  nombre: this.producto.nombre,
                  descripcion: 'Nuevo producto agregado',
                  fecha: new Date().toISOString(),
                });
        })
        .catch((error) => {
          console.error('Error al agregar el producto:', error);
        });
    }
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
  
  // Método para actualizar el stock de un producto
  actualizarStock(id: string, nuevoStock: number) {
    const producto = this.productos.find((p) => p.id === id);
    if (producto) {
      this.productosService.actualizarStock(id, nuevoStock).then(() => {
        console.log('Stock actualizado');
  
        // Registrar movimiento
        this.movimientoService.agregarMovimiento({
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: `Stock actualizado a ${nuevoStock}`,
          fecha: new Date().toISOString(),
        });
      });
    }
  }




  // Método para abrir el formulario de agregar producto
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.producto = { codigo: '', nombre: '', stock: 0, categoria: '' }; // Limpiar campos

  }


  // Método para cerrar el formulario de agregar producto
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.productoId = null;
  }
}
