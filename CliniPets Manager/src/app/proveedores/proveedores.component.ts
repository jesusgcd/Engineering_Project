import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../models/producto.model';
import { map } from 'rxjs/operators';
import { FilterPipe } from '../filter.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../services/proveedores.service';
import { Proveedores } from '../models/proveedores.model';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  standalone: false,
})


export class ProveedoresComponent implements OnInit {
  proveedor: Proveedores = { nombreProveedor: '', descripcion: '', cedulaJuridica: '', estado: 'Activo', direccion: '', telefonoPrincipal: '', correoElectronico: '' , paginaWeb: ''};

  proveedores: Proveedores[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false; // Indica si se está editando un proveedor
  proveedorId: string | null = null; // Almacena el ID del proveedor que se está editando

  // Variable para guardar mensaje de error al no completar los campos
  mensajeExitoExistencia: string = '';

  // Variables para el paginado
  currentPage: number = 1; // Página actual
  pageSize: number = 7; // Cantidad de registros por página
  totalPages: number = 0; // Total de páginas calculadas
  proveedoresPaginados: Proveedores[] = []; // Proveedores que se muestran en la página actual

  // Variables para el modal de visualización
  proveedorSeleccionado: Proveedores | null = null;
  verModalVisible: boolean = false;

  // Variables para el modal de eliminación
  mostrarModal: boolean = false;  // Controla la visibilidad del modal
  proveedorAEliminarId: string | null = null;  // Almacena el ID del proveedor a eliminar
  modalEliminarMessage: string = ''; //Modal que almacena el mensaje para eliminar una mascota

  constructor(private proveedoresService: ProveedoresService) { }

  ngOnInit(): void {
    this.proveedoresService
      .obtenerProveedor()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Proveedores),
          })))
      )
      .subscribe(
        (proveedor: Proveedores[]) => {
          this.proveedores = proveedor;
        },
        (error) => {
          console.error('Error al obtener proveedores:', error);
        }
      );
  }

  editarProveedor(proveedor: Proveedores) {
    this.proveedor = { ...proveedor }; // Copiar los datos del proveedor seleccionado
    this.modoEdicion = true; // Activar modo edición
    this.proveedorId = proveedor.id || null; // Guardar el ID del producto
    this.mostrarFormulario = true; // Mostrar el formulario emergente
  }

  agregarProveedor() {
    // Verificar que todos los campos estén llenos
    if (!this.proveedor.nombreProveedor || !this.proveedor.descripcion 
      || !this.proveedor.cedulaJuridica || !this.proveedor.direccion 
      || !this.proveedor.telefonoPrincipal || !this.proveedor.correoElectronico 
      || !this.proveedor.paginaWeb) {
      this.mostrarMensaje('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    if (this.modoEdicion) {
      // Editar proveedor existente
      if (this.proveedorId) {
        this.proveedoresService
          .actualizarProveedor(this.proveedorId, this.proveedor)
          .then(() => {
            console.log('Proveedor actualizado con éxito');
            this.mensajeExito = true;
            setTimeout(() => {
              this.mensajeExito = false;
            }, 5000);
            this.cerrarFormulario();
          })
          .catch((error) => {
            console.error('Error al actualizar el proveedor:', error);
          });
      }
    } else {
      // Agregar nuevo proveedor
      const nombreProveedorExiste = this.proveedores.some(
        (prov) => prov.nombreProveedor.toLowerCase() === this.proveedor.nombreProveedor.toLowerCase()
      );

      if (nombreProveedorExiste) {
        this.mostrarMensajeDinamico('El Proveedor ya existe. Por favor, vuelve a intentarlo.');
        return;
      }

      this.proveedoresService.agregarProveedor(this.proveedor).then(() => {
        this.mensajeExito = true;
        setTimeout(() => {
          this.mensajeExito = false;
        }, 5000);
        this.proveedor = { nombreProveedor: '', descripcion: '', cedulaJuridica: '', estado: 'Activo', direccion: '', telefonoPrincipal: '', correoElectronico: '', paginaWeb: ''}; // Limpiar el formulario
        this.cerrarFormulario();
      });
    }
  }

  // Método para actualizar la informacion de un proveedor
  actualizarProveedor() {
    if (this.proveedorId) {
      this.proveedoresService
        .actualizarProveedor(this.proveedorId, this.proveedor)
        .then(() => {
          this.mostrarMensajeDinamico('Proveedor actualizado con éxito', true, () => {
            this.cerrarFormulario();
          });
        })
        .catch((error) => {
          console.error('Error al actualizar el proveedor:', error);
        });
    }
  }

  // Método para abrir el modal y mostrar la información del proveedor seleccionado
  verDetallesProveedor(proveedor: Proveedores) {
    this.proveedorSeleccionado = proveedor;
    this.verModalVisible = true;
  }

  // Método para cerrar el modal
  cerrarModalVer() {
    this.proveedorSeleccionado = null;
    this.verModalVisible = false;
  }


  // Función que realiza la eliminación de un proveedor
  eliminarProveedor(id: string, nombreProveedor: string) {
    this.proveedorAEliminarId = id;
    console.log('ID del proveedor a eliminar:', id); // Depura el valor de `id`
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar el proveedor llamado "${nombreProveedor}"?` // Mensaje de confirmación;
    this.mostrarModal = true; // Mostrar el modal
  }



  // Método para abrir el formulario de agregar proveedor
  abrirFormulario() {
    this.mostrarFormulario = true;
    this.proveedor = { nombreProveedor: '', descripcion: '', cedulaJuridica: '', estado: 'Activo', direccion: '', telefonoPrincipal: '', correoElectronico: '' , paginaWeb: ''}; // Limpiar campos
  }



  // Método para cerrar el formulario de agregar proveedor
  cerrarFormulario() {
    this.mostrarFormulario = false;
  }


  mensajeDinamico: string = ''; // Variable para el mensaje dinámico

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
    if (confirmar && this.proveedorAEliminarId) {
      this.proveedoresService.eliminarProveedor(this.proveedorAEliminarId)
        .then(() => {
          this.mostrarMensajeDinamico(`Proveedor eliminado con éxito!`);
          // Actualiza la lista local solo si la eliminación fue exitosa
          this.proveedores = this.proveedores.filter(m => m.id !== this.proveedorAEliminarId);
          this.calculatePagination(); // Actualiza la paginación
        })
        .catch((error) => {
          this.mostrarMensajeDinamico('Error al eliminar el proveedor de Firestore:', error);
        });
    }
    this.mostrarModal = false; // Ocultar el modal
  }



  // Método para calcular las páginas
  calculatePagination() {
    this.totalPages = Math.ceil(this.proveedores.length / this.pageSize);
    this.updatePaginatedMascotas();
  }

  // Funcion que realiza la actualizacion de las mascotas que se muestran en la página actual
  updatePaginatedMascotas() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.proveedoresPaginados = this.proveedores.slice(startIndex, endIndex);
  }

  // Funcion que realiza el cambio de página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedMascotas();
    }
  }

  // Funcion que permite avanzar a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedMascotas();
    }
  }

  // Funcion que permite retroceder a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedMascotas();
    }
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

