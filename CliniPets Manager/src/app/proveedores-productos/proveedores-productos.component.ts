import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProveedoresContactos } from '../models/proveedoresContactos.model';
import { ProveedoresContactosService } from '../services/proveedores-contactos.service';
import { Proveedores } from '../models/proveedores.model';
import { ProveedoresService } from '../services/proveedores.service';
import { ProveedoresProductos } from '../models/proveedoresProductos.model';
import { ProveedoresProductosService } from '../services/proveedores-productos.service';

@Component({
  selector: 'app-proveedores-productos',
  standalone: false,

  templateUrl: './proveedores-productos.component.html',
  styleUrl: './proveedores-productos.component.css'
})




export class ProveedoresProductosComponent {

  proveedorProducto: ProveedoresProductos = { proveedorEmpresaNombre: '', nombreProducto: '', descripcion: '', precioUnitario: '', notas: '' };

  // Variables para el pop-up de empresas proveedoras
  empresasProveedoras: Proveedores[] = []; //Almacena las razas disponibles para mostrarlas
  filtroProveedor: string = ''; //Variable que almacena el filtro de busqueda en el modal de empresas proveedoras
  proveedoresFiltrados: Proveedores[] = []; // Almacena el proveedor filtrados
  mostrarModalEmpresaProveedora: boolean = false;

  // Variables para el listado de productos de proveedores
  proveedorProductos: ProveedoresProductos[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false; // Indica si se está editando un contacto
  proveedorProductoId: string | null = null; // Almacena el ID del contacto que se está editando
  mensajeDinamico: string = ''; // Variable para el mensaje dinámico

   // Variable para guardar mensaje de error al no completar los campos
   mensajeExitoExistencia: string = '';


  // Variables para el paginado
  currentPage: number = 1; // Página actual
  pageSize: number = 7; // Cantidad de registros por página
  totalPages: number = 0; // Total de páginas calculadas
  proveedoresProductosPaginados: ProveedoresProductos[] = []; // Proveedores contactos que se muestran en la página actual

  // Variables para el modal de visualización
  productoSeleccionado: ProveedoresProductos | null = null;
  verModalVisible: boolean = false;

  // Variables para el modal de eliminación
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  proveedorProductoAEliminarId: string | null = null;  // Almacena el ID del proveedor a eliminar
  modalEliminarMessage: string = ''; //Modal que almacena el mensaje para eliminar un contacto de proveedor

  constructor(private proveedoresProductoService: ProveedoresProductosService, private ProveedoresService: ProveedoresService) { }

  ngOnInit(): void {


    // Obtener la lista de contactos de proveedores 
    this.ProveedoresService.obtenerProveedor().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as Proveedores))
    ).subscribe((proveedores: Proveedores[]) => {
      this.empresasProveedoras = proveedores;
    });


    this.proveedoresProductoService
      .obtenerProveedorProducto()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as ProveedoresProductos),
          })))
      )
      .subscribe(
        (proveedorProducto: ProveedoresProductos[]) => {
          this.proveedorProductos = proveedorProducto;
        },
        (error) => {
          console.error('Error al obtener contactos de proveedores:', error);
        }
      );
  }


  editarProductoProveedor(proveedorProducto: ProveedoresProductos) {
    this.proveedorProducto = { ...proveedorProducto }; // Copiar los datos del producto seleccionado
    this.modoEdicion = true; // Activar modo edición
    this.proveedorProductoId = proveedorProducto.id || null; // Guardar el ID del producto
    this.mostrarFormulario = true; // Mostrar el formulario emergente
  }



  // Método para abrir el formulario de agregar productos de proveedor
  agregarProductoProveedor() {


    
    // Verificar que todos los campos estén llenos
    if (!this.proveedorProducto.proveedorEmpresaNombre || !this.proveedorProducto.nombreProducto 
      || !this.proveedorProducto.descripcion || !this.proveedorProducto.precioUnitario 
      || !this.proveedorProducto.notas) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    if (this.modoEdicion) {
      // Editar contacto de proveedor existente
      if (this.proveedorProductoId) {
        this.proveedoresProductoService
          .actualizarProveedorProducto(this.proveedorProductoId, this.proveedorProducto)
          .then(() => {
            console.log('Producto de proveedor actualizado con éxito');
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            console.error('Error al actualizar el producto de proveedor:', error);
          });
      }
    } else {
      // Agregar nuevo producto de proveedor
      const nombreProductoExiste = this.proveedorProductos.some(
        (provProducto) =>
          provProducto.nombreProducto.toLowerCase() === this.proveedorProducto.nombreProducto.toLowerCase()
      );

      if (nombreProductoExiste) {
        this.mostrarMensajeDinamico('El contacto de proveedor ya existe. Por favor, vuelve a intentarlo.');
        return;
      }

      this.proveedoresProductoService.agregarProveedorProducto(this.proveedorProducto).then(() => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);
        this.proveedorProducto = { proveedorEmpresaNombre: '', nombreProducto: '', descripcion: '', precioUnitario: '', notas: '' }; // Limpiar el formulario
        this.cerrarFormulario();
      });
    }
  }

  // Método para actualizar la informacion de un proveedor
  actualizarProductoProveedor() {
    if (this.proveedorProductoId) {
      this.proveedoresProductoService
        .actualizarProveedorProducto(this.proveedorProductoId, this.proveedorProducto)
        .then(() => {
          this.mostrarMensajeDinamico('Producto de proveedor actualizado con éxito', true, () => {
            this.cerrarFormulario();
          });
        })
        .catch((error) => {
          console.error('Error al actualizar el producto del proveedor:', error);
        });
    }
  }

  // Método para abrir el modal y mostrar la información del producto seleccionado
  verDetallesProveedor(proveedorProducto: ProveedoresProductos) {
    this.productoSeleccionado = proveedorProducto;
    this.verModalVisible = true;
  }

  // Método para cerrar el modal
  cerrarModalVer() {
    this.productoSeleccionado = null;
    this.verModalVisible = false;
  }


  // Función que realiza la eliminación de un producto de proveedor
  eliminarProductoProveedor(id: string, nombreProducto: string) {
    this.proveedorProductoAEliminarId = id;
    console.log('ID del producto de proveedor a eliminar:', id); // Depura el valor de `id`
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar el contacto de proveedor llamado "${nombreProducto}"?`; // Mensaje de confirmación
    this.mostrarModal = true; // Mostrar el modal
  }


  // Método para abrir el formulario de agregar contacto de proveedor
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.proveedorProducto = { proveedorEmpresaNombre: '', nombreProducto: '', descripcion: '', precioUnitario: '', notas: '' }; // Limpiar campos
  }



  // Método para cerrar el formulario de agregar proveedor
  cerrarFormulario() {
    this.mostrarFormulario = false;
  }



  //Muestra un mensaje dinamico deseado
  mostrarMensajeDinamico(mensaje: string, cerrarFormulario: boolean = false, callback?: () => void) {
    if (this.mensajeDinamico) {
      // Evita que se muestre dos veces si ya hay un mensaje activo
      return;
    }

    this.mensajeDinamico = mensaje; // Asignar mensaje dinámico
    setTimeout(() => {
      this.mensajeDinamico = ''; // Limpiar el mensaje
      if (cerrarFormulario && callback) {
        callback(); // Ejecutar la función de cierre si se proporciona
      }
    }, 2000);

  }


  // Procesar la confirmación en el modal
  confirmarEliminacion(confirmar: boolean) {
    if (confirmar && this.proveedorProductoAEliminarId) {
      this.proveedoresProductoService.eliminarProveedorProducto(this.proveedorProductoAEliminarId)
        .then(() => {
          this.mostrarMensajeDinamico(`Producto de proveedor eliminado con éxito!`);
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.proveedorProductos = this.proveedorProductos.filter(m => m.id !== this.proveedorProductoAEliminarId);
          this.calculatePagination(); // Actualiza la paginación
        })
        .catch((error) => {
          this.mostrarMensajeDinamico('Error al eliminar el producto de proveedor de Firestore:', error);
        });
    }
    this.mostrarModal = false; // Ocultar el modal
  }



  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.proveedorProductos.length / this.pageSize);
    this.updatePaginatedProductosProveedor();
  }

  // Funcion que realiza la actualizacion de los contactos de proveedores que se muestran en la página actual
  updatePaginatedProductosProveedor() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.proveedoresProductosPaginados = this.proveedorProductos.slice(startIndex, endIndex);
  }

  // Funcion que realiza el cambio de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProductosProveedor();
    }
  }

  // Funcion que permite avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProductosProveedor();
    }
  }

  // Funcion que permite retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProductosProveedor();
    }
  }


  // Método para filtrar los proveedores por nombre
  filtrarProveedores() {
    this.empresasProveedoras = this.empresasProveedoras.filter((proveedor) =>
      proveedor.nombreProveedor.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Método para seleccionar un proveedor
  seleccionarProveedor(proveedor: Proveedores) {
    this.proveedorProducto.proveedorEmpresaNombre = proveedor.nombreProveedor; // Asigna el nombre del proveedor seleccionado al contacto
    this.cerrarModalProveedores(); // Cierra el modal de proveedores
  }

  // Método para cerrar el modal de detalles del proveedor
  cerrarModalProveedores(): void {
    this.productoSeleccionado = null;
    this.mostrarModalEmpresaProveedora = false;
  }

  abrirModalProveedores() {
    this.mostrarModalEmpresaProveedora = true;
  }

    // Mostrar mensaje de éxito con cierre automático
    mostrarMensaje(mensaje: string, cerrarFormulario: boolean=false, callback?: () => void) {
      this.mensajeExitoExistencia = mensaje; 
      setTimeout(() => {
        this.mensajeExitoExistencia = ''; 
        
        if (cerrarFormulario && callback) {
          callback(); 
          this.cerrarFormulario();
        }
  
      }, 2000);
    }

}
