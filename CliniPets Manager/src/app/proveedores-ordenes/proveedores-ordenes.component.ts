import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProveedoresContactos } from '../models/proveedoresContactos.model';
import { ProveedoresContactosService } from '../services/proveedores-contactos.service';
import { Proveedores } from '../models/proveedores.model';
import { ProveedoresService } from '../services/proveedores.service';
import { ProveedoresOrdenes } from '../models/proveedoresOrdenes';
import { ProveedoresOrdenesService } from '../services/proveedores-ordenes.service';

@Component({
  selector: 'app-proveedores-ordenes',
  standalone: false,

  templateUrl: './proveedores-ordenes.component.html',
  styleUrl: './proveedores-ordenes.component.css'
})

export class ProveedoresOrdenesComponent implements OnInit {
  proveedorOrden: ProveedoresOrdenes = { proveedorEmpresaNombre: '', listaProductos: '', numeroOrden: '', fechaCreacion: '', fechaEntrega: '', estadoOrden: 'Pendiente', montoAproximado: '', notas: '' };

  // Variables para el pop-up de empresas proveedoras
  // [NO EDITAR]
  empresasProveedoras: Proveedores[] = []; //Almacena las razas disponibles para mostrarlas
  filtroProveedor: string = ''; //Variable que almacena el filtro de busqueda en el modal de empresas proveedoras
  proveedoresFiltrados: Proveedores[] = []; // Almacena el proveedor filtrados
  mostrarModalEmpresaProveedora: boolean = false;

  // Variable para guardar mensaje de error al no completar los campos
  mensajeExitoExistencia: string = '';

  // Variables para el listado de contactos de proveedores
  proveedorOrdenes: ProveedoresOrdenes[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false; // Indica si se está editando un contacto
  proveedorOrdenId: string | null = null; // Almacena el ID del contacto que se está editando
  mensajeDinamico: string = ''; // Variable para el mensaje dinámico

  // Variables para el paginado
  currentPage: number = 1; // Página actual
  pageSize: number = 7; // Cantidad de registros por página
  totalPages: number = 0; // Total de páginas calculadas
  proveedoresOrdenesPaginados: ProveedoresOrdenes[] = []; // Proveedores contactos que se muestran en la página actual

  // Variables para el modal de visualización
  proveedorOrdenSeleccionado: ProveedoresOrdenes | null = null;
  verModalVisible: boolean = false;

  // Variables para el modal de eliminación
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  proveedorOrdenAEliminarId: string | null = null;  // Almacena el ID del proveedor a eliminar
  modalEliminarMessage: string = ''; //Modal que almacena el mensaje para eliminar un contacto de proveedor

  constructor(private proveedoresOrdenesService: ProveedoresOrdenesService, private ProveedoresService: ProveedoresService) { }

  ngOnInit(): void {


    // Obtener la lista de contactos de proveedores 
    this.ProveedoresService.obtenerProveedor().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as Proveedores))
    ).subscribe((proveedores: Proveedores[]) => {
      this.empresasProveedoras = proveedores;
    });


    this.proveedoresOrdenesService
      .obtenerProveedorOrden()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as ProveedoresOrdenes),
          })))
      )
      .subscribe(
        (proveedorOrden: ProveedoresOrdenes[]) => {
          this.proveedorOrdenes = proveedorOrden;
        },
        (error) => {
          console.error('Error al obtener contactos de proveedores:', error);
        }
      );
  }
  // Método para editar una orden de proveedor
  editarOrdenProveedor(proveedorOrden: ProveedoresOrdenes) {
    this.proveedorOrden = { ...proveedorOrden }; // Copiar los datos de la orden seleccionada
    this.modoEdicion = true; // Activar modo edición
    this.proveedorOrdenId = proveedorOrden.id || null; // Guardar el ID de la orden
    this.mostrarFormulario = true; // Mostrar el formulario emergente
  }



  // Método para abrir el formulario de agregar contacto de proveedor
  agregarProveedorOrden() {

        // Verificar que todos los campos estén llenos
        if (!this.proveedorOrden.proveedorEmpresaNombre || !this.proveedorOrden.listaProductos 
          || !this.proveedorOrden.numeroOrden || !this.proveedorOrden.fechaCreacion 
          || !this.proveedorOrden.fechaEntrega || !this.proveedorOrden.estadoOrden 
          || !this.proveedorOrden.montoAproximado || !this.proveedorOrden.notas) {
          this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
          return;
        }

    if (this.modoEdicion) {
      // Editar contacto de proveedor existente
      if (this.proveedorOrdenId) {
        this.proveedoresOrdenesService
          .actualizarProveedorOrden(this.proveedorOrdenId, this.proveedorOrden)
          .then(() => {
            console.log('Orden del proveedor actualizado con éxito');
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            console.error('Error al actualizar la orden del proveedor:', error);
          });
      }
    } else {
      // Agregar nuevo contacto de proveedor
      const nombreOrdenExiste = this.proveedorOrdenes.some(
        (provOrden) =>
          provOrden.numeroOrden.toLowerCase() === this.proveedorOrden.numeroOrden.toLowerCase()
      );

      if (nombreOrdenExiste) {
        this.mostrarMensajeDinamico('La orden ya existe. Por favor, vuelve a intentarlo.');
        return;
      }

      this.proveedoresOrdenesService.agregarProveedorOrden(this.proveedorOrden).then(() => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);
        this.proveedorOrden = { proveedorEmpresaNombre: '', listaProductos: '', numeroOrden: '', fechaCreacion: '', fechaEntrega: '', estadoOrden: 'Pendiente', montoAproximado: '', notas: '' }; // Limpiar el formulario
        this.cerrarFormulario();
      });
    }
  }

  // Método para actualizar la informacion de un proveedor
  actualizarProveedorOrden() {
    if (this.proveedorOrdenId) {
      this.proveedoresOrdenesService
        .actualizarProveedorOrden(this.proveedorOrdenId, this.proveedorOrden)
        .then(() => {
          this.mostrarMensajeDinamico('Orden de proveedor actualizado con éxito', true, () => {
            this.cerrarFormulario();
          });
        })
        .catch((error) => {
          console.error('Error al actualizar la orden del proveedor:', error);
        });
    }
  }

  // Método para abrir el modal y mostrar la información del proveedor seleccionado
  // no cambiar el nombre de la variable de la función
  verDetallesProveedor(proveedorOrden: ProveedoresOrdenes) {
    this.proveedorOrdenSeleccionado = proveedorOrden;
    this.verModalVisible = true;
  }

  // Método para cerrar el modal
  cerrarModalVer() {
    this.proveedorOrdenSeleccionado = null;
    this.verModalVisible = false;
  }


  // Función que realiza la eliminación de un contacto de proveedor
  eliminarProveedorOrden(id: string, numeroOrden: string) {
    this.proveedorOrdenAEliminarId = id;
    console.log('ID de la orden de proveedor a eliminar:', id); // Depura el valor de `id`
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar la orden "${numeroOrden}"?`; // Mensaje de confirmación
    this.mostrarModal = true; // Mostrar el modal
  }



  // Método para abrir el formulario de agregar contacto de proveedor
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.proveedorOrden = { proveedorEmpresaNombre: '', listaProductos: '', numeroOrden: '', fechaCreacion: '', fechaEntrega: '', estadoOrden: 'Pendiente', montoAproximado: '', notas: '' }; // Limpiar campos
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
    if (confirmar && this.proveedorOrdenAEliminarId) {
      this.proveedoresOrdenesService.eliminarProveedorOrden(this.proveedorOrdenAEliminarId)
        .then(() => {
          this.mostrarMensajeDinamico(`Orden de proveedor eliminada con éxito!`);
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.proveedorOrdenes = this.proveedorOrdenes.filter(m => m.id !== this.proveedorOrdenAEliminarId);
          this.calculatePagination(); // Actualiza la paginación
        })
        .catch((error) => {
          this.mostrarMensajeDinamico('Error al eliminar la orden de proveedor de Firestore:', error);
        });
    }
    this.mostrarModal = false; // Ocultar el modal
  }



  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.proveedorOrdenes.length / this.pageSize);
    this.updatePaginatedOrdenesProveedor();
  }

  // Funcion que realiza la actualizacion de los contactos de proveedores que se muestran en la página actual
  updatePaginatedOrdenesProveedor() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.proveedoresOrdenesPaginados = this.proveedorOrdenes.slice(startIndex, endIndex);
  }

  // Funcion que realiza el cambio de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrdenesProveedor();
    }
  }

  // Funcion que permite avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrdenesProveedor();
    }
  }

  // Funcion que permite retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrdenesProveedor();
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
    this.proveedorOrden.proveedorEmpresaNombre = proveedor.nombreProveedor; // Asigna el nombre del proveedor seleccionado al contacto
    this.cerrarModalProveedores(); // Cierra el modal de proveedores
  }

  // Método para cerrar el modal de detalles del proveedor
  cerrarModalProveedores(): void {
    this.proveedorOrdenSeleccionado = null;
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
