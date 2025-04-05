import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Proveedores } from '../models/proveedores.model';
import { ProveedoresService } from '../services/proveedores.service';
import { ProveedoresServiciosOfrecidos } from '../models/proveedoresServiciosOfrecidos.model';
import { ProveedoresServiciosOfrecidosService } from '../services/proveedores-servicios-ofrecidos.service';


@Component({
  selector: 'app-proveedores-servicios-ofrecidos',
  standalone: false,
  
  templateUrl: './proveedores-servicios-ofrecidos.component.html',
  styleUrl: './proveedores-servicios-ofrecidos.component.css'
})


export class ProveedoresServiciosOfrecidosComponent implements OnInit {
  proveedorServicioOfrecido: ProveedoresServiciosOfrecidos = { proveedorEmpresaNombre: '', nombreServicio: '', descripcion: '', costo: '', notas: '' };

  // Variables para el pop-up de empresas proveedoras
  empresasProveedoras: Proveedores[] = []; //Almacena las razas disponibles para mostrarlas
  filtroProveedor: string = ''; //Variable que almacena el filtro de busqueda en el modal de empresas proveedoras
  proveedoresFiltrados: Proveedores[] = []; // Almacena el proveedor filtrados
  mostrarModalEmpresaProveedora: boolean = false;

    // Variable para guardar mensaje de error al no completar los campos
    mensajeExitoExistencia: string = '';

  // Variables para la lista de servicios ofrecidos
  proveedorServiciosOfrecidos: ProveedoresServiciosOfrecidos[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false; // Indica si se está editando un servicio ofrecido
  proveedorServicioOfrecidoId: string | null = null; // Almacena el ID del servicio ofrecido que se está editando
  mensajeDinamico: string = ''; // Variable para mensajes dinámicos

  // Variables de paginación
  currentPage: number = 1; // Página actual
  pageSize: number = 7; // Número de registros por página
  totalPages: number = 0; // Total de páginas calculadas
  proveedoresServiciosOfrecidosPaginados: ProveedoresServiciosOfrecidos[] = []; // Servicios ofrecidos mostrados en la página actual

  // Variables para el modal de vista
  servicioOfrecidoSeleccionado: ProveedoresServiciosOfrecidos | null = null;
  verModalVisible: boolean = false;

  // Variables para el modal de eliminación
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  proveedorServicioOfrecidoAEliminarId: string | null = null;  // Almacena el ID del servicio ofrecido a eliminar
  modalEliminarMessage: string = ''; // Almacena el mensaje para eliminar un servicio ofrecido

  constructor(private proveedoresServiciosOfrecidosService: ProveedoresServiciosOfrecidosService, private ProveedoresService: ProveedoresService) { }

  ngOnInit(): void {


    // Obtener la lista de contactos de proveedores 
    // (Dejar quedita esta parte)
    this.ProveedoresService.obtenerProveedor().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as Proveedores))
    ).subscribe((proveedores: Proveedores[]) => {
      this.empresasProveedoras = proveedores;
    });
    
    
    this.proveedoresServiciosOfrecidosService
      .obtenerProveedorServicioOfrecido()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as ProveedoresServiciosOfrecidos),
          })))
      )
      .subscribe(
        (ProveedorServicioOfrecido: ProveedoresServiciosOfrecidos[]) => {
          this.proveedorServiciosOfrecidos = ProveedorServicioOfrecido; // AQUI ESTA EL PROBLEMA! Con las listas donde guarda
        },
        (error) => {
          console.error('Error al obtener servicios de proveedores:', error);
        }
      );
  }

  // Cambiarle siempre el nombre a esta función porque se usa en el html
  editarServicioOfrecidoProveedor(proveedorServicioOfrecido: ProveedoresServiciosOfrecidos) {
    this.proveedorServicioOfrecido = { ...proveedorServicioOfrecido }; // Copiar los datos del contacto seleccionado
    this.modoEdicion = true; // Activar modo edición
    this.proveedorServicioOfrecidoId = proveedorServicioOfrecido.id || null; // Guardar el ID del contacto
    this.mostrarFormulario = true; // Mostrar el formulario emergente
  }


  // Método para abrir el formulario de agregar contacto de proveedor
  agregarProveedorServicioOfrecido() {


    // Verificar que todos los campos estén llenos
    if (!this.proveedorServicioOfrecido.proveedorEmpresaNombre || !this.proveedorServicioOfrecido.nombreServicio 
      || !this.proveedorServicioOfrecido.descripcion || !this.proveedorServicioOfrecido.costo 
      || !this.proveedorServicioOfrecido.notas ) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    if (this.modoEdicion) {
      // Editar contacto de proveedor existente
      if (this.proveedorServicioOfrecidoId) {
        this.proveedoresServiciosOfrecidosService
          .actualizarProveedorServicioOfrecido(this.proveedorServicioOfrecidoId, this.proveedorServicioOfrecido)
          .then(() => {
            console.log('Servicio del proveedor actualizado con éxito');
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            console.error('Error al actualizar el servicio del proveedor:', error);
          });
      }
    } else {
      // Agregar nuevo contacto de proveedor
      const nombreServicioOfrecidoExiste = this.proveedorServiciosOfrecidos.some(
        (provServicioOfrecido) => 
          provServicioOfrecido.nombreServicio.toLowerCase() === this.proveedorServicioOfrecido.nombreServicio.toLowerCase()
      );

      if (nombreServicioOfrecidoExiste) {
        this.mostrarMensajeDinamico('El servicio de proveedor ya existe. Por favor, vuelve a intentarlo.');
        return;
      }

      this.proveedoresServiciosOfrecidosService.agregarProveedorServicioOfrecido(this.proveedorServicioOfrecido).then(() => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);
        this.proveedorServicioOfrecido = { proveedorEmpresaNombre: '', nombreServicio: '', descripcion: '', costo: '', notas: '' }; // Limpiar el formulario
        this.cerrarFormulario();
      });
    }
  }

  // Método para actualizar la informacion de un proveedor
  actualizarProveedorServicioOfrecido() {
    if (this.proveedorServicioOfrecidoId) {
      this.proveedoresServiciosOfrecidosService
        .actualizarProveedorServicioOfrecido(this.proveedorServicioOfrecidoId, this.proveedorServicioOfrecido)
        .then(() => {
          this.mostrarMensajeDinamico('Servicio de proveedor actualizado con éxito', true, () => {
            this.cerrarFormulario();
          });
        })
        .catch((error) => {
          console.error('Error al actualizar el servicio del proveedor:', error);
        });
    }
  }

  // Método para abrir el modal y mostrar la información del proveedor seleccionado
  // A esta no cambiarle el nombre porque si no hay que cambiar otras cosas
  verDetallesProveedor(proveedorServicioOfrecido: ProveedoresServiciosOfrecidos) {
    this.servicioOfrecidoSeleccionado = proveedorServicioOfrecido;
    this.verModalVisible = true;
  }

  // Método para cerrar el modal
  cerrarModalVer() {
    this.servicioOfrecidoSeleccionado = null;
    this.verModalVisible = false;
  }


  // Función que realiza la eliminación de un contacto de proveedor
  eliminarServicioOfrecidoProveedor(id: string, nombreServicio: string) {
    this.proveedorServicioOfrecidoAEliminarId = id;
    console.log('ID del servicio del proveedor a eliminar:', id); // Depura el valor de `id`
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar el servicio del proveedor llamado "${nombreServicio}"?`; // Mensaje de confirmación
    this.mostrarModal = true; // Mostrar el modal
  }



  // Método para abrir el formulario de agregar contacto de proveedor
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.proveedorServicioOfrecido = { proveedorEmpresaNombre: '', nombreServicio: '', descripcion: '', costo: '', notas: '' }; // Limpiar campos
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
    if (confirmar && this.proveedorServicioOfrecidoAEliminarId) {
      this.proveedoresServiciosOfrecidosService.eliminarProveedorServicioOfrecido(this.proveedorServicioOfrecidoAEliminarId)
        .then(() => {
          this.mostrarMensajeDinamico(`Servicio de proveedor eliminado con éxito!`);
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.proveedorServiciosOfrecidos = this.proveedorServiciosOfrecidos.filter(m => m.id !== this.proveedorServicioOfrecidoAEliminarId);
          this.calculatePagination(); // Actualiza la paginación
        })
        .catch((error) => {
          this.mostrarMensajeDinamico('Error al eliminar el servicio del proveedor de Firestore:', error);
        });
    }
    this.mostrarModal = false; // Ocultar el modal
  }



  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.proveedorServiciosOfrecidos.length / this.pageSize);
    this.updatePaginatedServiciosOfrecidosProveedor();
  }

  // Funcion que realiza la actualizacion de los contactos de proveedores que se muestran en la página actual
  updatePaginatedServiciosOfrecidosProveedor() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.proveedoresServiciosOfrecidosPaginados = this.proveedorServiciosOfrecidos.slice(startIndex, endIndex);
  }

  // Funcion que realiza el cambio de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedServiciosOfrecidosProveedor();
    }
  }

  // Funcion que permite avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedServiciosOfrecidosProveedor();
    }
  }

  // Funcion que permite retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedServiciosOfrecidosProveedor();
    }
  }


// Método para filtrar los proveedores por nombre
filtrarProveedores() {
  this.empresasProveedoras = this.empresasProveedoras.filter((proveedor) =>
    proveedor.nombreProveedor.toLowerCase().includes(this.filtro.toLowerCase())
  );
}

// Método para seleccionar un proveedor

// A esta no cambiarle el nombre porque si no hay que cambiar otras cosas
seleccionarProveedor(proveedor: Proveedores) {
  this.proveedorServicioOfrecido.proveedorEmpresaNombre = proveedor.nombreProveedor; // Asigna el nombre del proveedor seleccionado al contacto
  this.cerrarModalProveedores(); // Cierra el modal de proveedores
}

// Método para cerrar el modal de detalles del proveedor
cerrarModalProveedores(): void {
  this.servicioOfrecidoSeleccionado = null;
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



