import { MascotasComponent } from './mascotas/mascotas.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventarioComponent } from './inventario/inventario.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { LoginComponent } from './login/login.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CitasComponent } from './citas/citas.component';
import { ProductosComponent } from './productos/productos.component';
import { MenuPrincipalAdminComponent } from './menu-principal-admin/menu-principal.component';
import { MenuInicialTodoComponent } from './menu-inicial-todo/menu-principal.component';
import { RazasMascotasComponent } from './razas-mascotas/razas-mascotas.component';

import { SalasComponent } from './salas/salas.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { FacturasComponent } from './facturas/facturas.component';
import { CalendarioComponent } from './calendario/calendario.component';

import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedoresContactosComponent } from './proveedores-contactos/proveedores-contactos.component';
import { ProveedoresProductosComponent } from './proveedores-productos/proveedores-productos.component';
import { ProveedoresServiciosOfrecidosComponent } from './proveedores-servicios-ofrecidos/proveedores-servicios-ofrecidos.component';
import { ProveedoresOrdenesComponent } from './proveedores-ordenes/proveedores-ordenes.component';


import { CategoriasComponent } from './categorias/categorias.component';
import { AgotadosComponent } from './agotados/agotados.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { LotesComponent } from './lotes/lotes.component';

import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ToDoListHechoComponent } from './to-do-list-hecho/to-do-list-hecho.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { DetallesExpedienteComponent } from './detalles-expediente/detalles-expediente.component';
import { HojasInternamientoComponent } from './hojas-internamiento/hojas-internamiento.component';
import { NotasSeguimientoComponent } from './notas-seguimiento/notas-seguimiento.component';
import { InformesMedicosComponent } from './informes-medicos/informes-medicos.component';
import { SeguimientoVacunasComponent } from './seguimiento-vacunas/seguimiento-vacunas.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta para el componente Login
  { path: 'MenuInicialTodos', component: MenuInicialTodoComponent },
  { path: 'login/reset-password', component: ResetPasswordComponent },
  { path: 'inventario', component: InventarioComponent }, // Ruta para el componente inventario
  { path: 'productos', component: ProductosComponent },
  { path: 'menuPrincipal', component: MenuPrincipalComponent }, // Ruta para el componente Menu principal
  { path: 'menuPrincipalAdmin', component: MenuPrincipalAdminComponent }, // Ruta para el componente Menu principal
  { path: 'adminUsuario', component: AdminUsuariosComponent }, // Ruta para el componente Admin Usuarios
  { path: 'registerUsers', component: RegisterUserComponent }, // Ruta para el register user
  { path: 'reset-password-confirm', component: ResetPasswordConfirmComponent },
  { path: 'citas', component: CitasComponent }, // Ruta para el componente Admin Usuarios
  { path: 'especialistas', component: EspecialistasComponent },
  { path: 'salas', component: SalasComponent },
  { path: 'to-do-list-pendiente', component: ToDoListComponent },
  { path: 'to-do-list-hecho', component: ToDoListHechoComponent },
  { path: 'facturas', component: FacturasComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'mascotas', component: MascotasComponent }, // Ruta para el componente gestion de mascotas
  { path: 'razas', component: RazasMascotasComponent }, // Ruta para el componente gestion de mascotas
  
  { path: 'proveedores', component: ProveedoresComponent }, // Ruta para el componente gestion de proveedores
  { path: 'proveedores-contactos', component: ProveedoresContactosComponent }, // Ruta para el componente gestion de proveedores
  { path : 'proveedores-productos', component: ProveedoresProductosComponent}, // Ruta para el componente gestion de proveedores
  { path : 'proveedores-servicios-ofrecidos', component: ProveedoresServiciosOfrecidosComponent}, // Ruta para el componente gestion de proveedores
  { path : 'proveedores-ordenes', component: ProveedoresOrdenesComponent}, // Ruta para el componente gestion de proveedores

  
  { path: 'categorias', component: CategoriasComponent },
  { path: 'agotados', component: AgotadosComponent },
  { path: 'movimientos', component: MovimientosComponent },
  { path: 'lotes', component: LotesComponent },
  { path: 'expedientes', component: ExpedientesComponent }, // Ruta para el componente expedientes
  
  { path: 'detalles-expediente', component: DetallesExpedienteComponent},
  { path: 'hojas-internamiento', component: HojasInternamientoComponent}, 
  { path: 'notas-seguimiento', component: NotasSeguimientoComponent}, 
  { path: 'informes-medicos', component: InformesMedicosComponent}, 
  { path: 'seguimiento-vacuna', component: SeguimientoVacunasComponent},

  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección por defecto
  { path: '**', redirectTo: '/login' } // Ruta para páginas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
