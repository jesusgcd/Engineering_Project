import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProveedoresContactos } from '../models/proveedoresContactos.model';
import { ProveedoresContactosService } from '../services/proveedores-contactos.service';
import { Proveedores } from '../models/proveedores.model';
import { ProveedoresService } from '../services/proveedores.service';


@Component({
  selector: 'app-proveedores-contactos',
  standalone: false,

  templateUrl: './proveedores-contactos.component.html',
  styleUrl: './proveedores-contactos.component.css'
})


export class ProveedoresContactosComponent implements OnInit {
  proveedorContacto: ProveedoresContactos = { proveedorEmpresaNombre: '', nombreContacto: '', puesto: '', telefonoPersonal: '', correoElectronico: '', notas: '' };

  // Variables para el pop-up de empresas proveedoras
  empresasProveedoras: Proveedores[] = []; //Almacena las razas disponibles para mostrarlas
  filtroProveedor: string = ''; //Variable que almacena el filtro de busqueda en el modal de empresas proveedoras
  proveedoresFiltrados: Proveedores[] = []; // Almacena el proveedor filtrados
  mostrarModalEmpresaProveedora: boolean = false;

    // Variable para guardar mensaje de error al no completar los campos
    mensajeExitoExistencia: string = '';

  // Variables para el listado de contactos de proveedores
  proveedorContactos: ProveedoresContactos[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false; // Indica si se está editando un contacto
  proveedorContactoId: string | null = null; // Almacena el ID del contacto que se está editando
  mensajeDinamico: string = ''; // Variable para el mensaje dinámico

  // Variables para el paginado
  currentPage: number = 1; // Página actual
  pageSize: number = 7; // Cantidad de registros por página
  totalPages: number = 0; // Total de páginas calculadas
  proveedoresContactosPaginados: ProveedoresContactos[] = []; // Proveedores contactos que se muestran en la página actual

  // Variables para el modal de visualización
  proveedorSeleccionado: ProveedoresContactos | null = null;
  verModalVisible: boolean = false;

  // Variables para el modal de eliminación
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  proveedorContactoAEliminarId: string | null = null;  // Almacena el ID del proveedor a eliminar
  modalEliminarMessage: string = ''; //Modal que almacena el mensaje para eliminar un contacto de proveedor

  constructor(private proveedoresContactosService: ProveedoresContactosService, private ProveedoresService: ProveedoresService) { }

  ngOnInit(): void {


    // Obtener la lista de contactos de proveedores 
    this.ProveedoresService.obtenerProveedor().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as Proveedores))
    ).subscribe((proveedores: Proveedores[]) => {
      this.empresasProveedoras = proveedores;
    });
    
    
    this.proveedoresContactosService
      .obtenerProveedorContacto()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as ProveedoresContactos),
          })))
      )
      .subscribe(
        (proveedorContacto: ProveedoresContactos[]) => {
          this.proveedorContactos = proveedorContacto;
        },
        (error) => {
          console.error('Error al obtener contactos de proveedores:', error);
        }
      );
  }

  editarContactoProveedor(proveedorContacto: ProveedoresContactos) {
    this.proveedorContacto = { ...proveedorContacto }; // Copiar los datos del contacto seleccionado
    this.modoEdicion = true; // Activar modo edición
    this.proveedorContactoId = proveedorContacto.id || null; // Guardar el ID del contacto
    this.mostrarFormulario = true; // Mostrar el formulario emergente
  }


  // Método para abrir el formulario de agregar contacto de proveedor
  agregarContactoProveedor() {



    // Verificar que todos los campos estén llenos
    if (!this.proveedorContacto.proveedorEmpresaNombre || !this.proveedorContacto.nombreContacto 
      || !this.proveedorContacto.puesto || !this.proveedorContacto.telefonoPersonal 
      || !this.proveedorContacto.correoElectronico || !this.proveedorContacto.notas) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }



    if (this.modoEdicion) {
      // Editar contacto de proveedor existente
      if (this.proveedorContactoId) {
        this.proveedoresContactosService
          .actualizarProveedorContacto(this.proveedorContactoId, this.proveedorContacto)
          .then(() => {
            console.log('Contacto de proveedor actualizado con éxito');
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            console.error('Error al actualizar el contacto de proveedor:', error);
          });
      }
    } else {
      // Agregar nuevo contacto de proveedor
      const nombreContactoExiste = this.proveedorContactos.some(
        (provContacto) => 
          provContacto.nombreContacto.toLowerCase() === this.proveedorContacto.nombreContacto.toLowerCase()
      );

      if (nombreContactoExiste) {
        this.mostrarMensajeDinamico('El contacto de proveedor ya existe. Por favor, vuelve a intentarlo.');
        return;
      }

      this.proveedoresContactosService.agregarProveedorContacto(this.proveedorContacto).then(() => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);
        this.proveedorContacto = { proveedorEmpresaNombre: '', nombreContacto: '', puesto: '', telefonoPersonal: '', correoElectronico: '', notas: '' }; // Limpiar el formulario
        this.cerrarFormulario();
      });
    }
  }

  // Método para actualizar la informacion de un proveedor
  actualizarContactoProveedor() {
    if (this.proveedorContactoId) {
      this.proveedoresContactosService
        .actualizarProveedorContacto(this.proveedorContactoId, this.proveedorContacto)
        .then(() => {
          this.mostrarMensajeDinamico('Contacto de proveedor actualizado con éxito', true, () => {
            this.cerrarFormulario();
          });
        })
        .catch((error) => {
          console.error('Error al actualizar el contacto de proveedor:', error);
        });
    }
  }

  // Método para abrir el modal y mostrar la información del proveedor seleccionado
  verDetallesProveedor(proveedorContacto: ProveedoresContactos) {
    this.proveedorSeleccionado = proveedorContacto;
    this.verModalVisible = true;
  }

  // Método para cerrar el modal
  cerrarModalVer() {
    this.proveedorSeleccionado = null;
    this.verModalVisible = false;
  }


  // Función que realiza la eliminación de un contacto de proveedor
  eliminarContactoProveedor(id: string, nombreContacto: string) {
    this.proveedorContactoAEliminarId = id;
    console.log('ID del contacto de proveedor a eliminar:', id); // Depura el valor de `id`
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar el contacto de proveedor llamado "${nombreContacto}"?`; // Mensaje de confirmación
    this.mostrarModal = true; // Mostrar el modal
  }



  // Método para abrir el formulario de agregar contacto de proveedor
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.proveedorContacto = { proveedorEmpresaNombre: '', nombreContacto: '', puesto: '', telefonoPersonal: '', correoElectronico: '', notas: '' }; // Limpiar campos
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
    if (confirmar && this.proveedorContactoAEliminarId) {
      this.proveedoresContactosService.eliminarProveedorContacto(this.proveedorContactoAEliminarId)
        .then(() => {
          this.mostrarMensajeDinamico(`Contacto de proveedor eliminado con éxito!`);
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.proveedorContactos = this.proveedorContactos.filter(m => m.id !== this.proveedorContactoAEliminarId);
          this.calculatePagination(); // Actualiza la paginación
        })
        .catch((error) => {
          this.mostrarMensajeDinamico('Error al eliminar el contacto de proveedor de Firestore:', error);
        });
    }
    this.mostrarModal = false; // Ocultar el modal
  }



  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.proveedorContactos.length / this.pageSize);
    this.updatePaginatedContactosProveedor();
  }

  // Funcion que realiza la actualizacion de los contactos de proveedores que se muestran en la página actual
  updatePaginatedContactosProveedor() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.proveedoresContactosPaginados = this.proveedorContactos.slice(startIndex, endIndex);
  }

  // Funcion que realiza el cambio de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedContactosProveedor();
    }
  }

  // Funcion que permite avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedContactosProveedor();
    }
  }

  // Funcion que permite retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedContactosProveedor();
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
  this.proveedorContacto.proveedorEmpresaNombre = proveedor.nombreProveedor; // Asigna el nombre del proveedor seleccionado al contacto
  this.cerrarModalProveedores(); // Cierra el modal de proveedores
}

// Método para cerrar el modal de detalles del proveedor
cerrarModalProveedores(): void {
  this.proveedorSeleccionado = null;
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



