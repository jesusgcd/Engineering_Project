import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { InventarioComponent } from './inventario/inventario.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CitasComponent } from './citas/citas.component';
import { AgotadosComponent } from './agotados/agotados.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { LotesComponent } from './lotes/lotes.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { FilterPipe } from './filter.pipe';
import { MascotasComponent } from './mascotas/mascotas.component';
import { ProductosComponent } from './productos/productos.component';
import { MenuPrincipalAdminComponent } from './menu-principal-admin/menu-principal.component';
import { ModalComponent } from './shared/modal/modal.component';
import { RazasMascotasComponent } from './razas-mascotas/razas-mascotas.component';
import { SalasComponent } from './salas/salas.component';
import { EspecialistasComponent } from './especialistas/especialistas.component';
import { FacturasComponent } from './facturas/facturas.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ToDoListHechoComponent } from './to-do-list-hecho/to-do-list-hecho.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { DetallesExpedienteComponent } from './detalles-expediente/detalles-expediente.component';
import { HojasInternamientoComponent } from './hojas-internamiento/hojas-internamiento.component';
import { NotasSeguimientoComponent } from './notas-seguimiento/notas-seguimiento.component';
import { InformesMedicosComponent } from './informes-medicos/informes-medicos.component';
import { SeguimientoVacunasComponent } from './seguimiento-vacunas/seguimiento-vacunas.component';
import { ProveedoresContactosComponent } from './proveedores-contactos/proveedores-contactos.component';
import { ProveedoresProductosComponent } from './proveedores-productos/proveedores-productos.component';
import { ProveedoresServiciosOfrecidosComponent } from './proveedores-servicios-ofrecidos/proveedores-servicios-ofrecidos.component';
import { ProveedoresOrdenesComponent } from './proveedores-ordenes/proveedores-ordenes.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    LoginComponent,
    InventarioComponent,
    MenuPrincipalComponent,
    AdminUsuariosComponent,
    ResetPasswordComponent,
    CitasComponent,

    MascotasComponent,
    ProductosComponent,

    MenuPrincipalAdminComponent,
    ModalComponent,
    RazasMascotasComponent,
    SalasComponent,
    EspecialistasComponent,
    FacturasComponent,
    CalendarioComponent,
    ToDoListComponent,
    ToDoListHechoComponent,
    ExpedientesComponent,
    DetallesExpedienteComponent,
    HojasInternamientoComponent,
    NotasSeguimientoComponent,
    InformesMedicosComponent,
    SeguimientoVacunasComponent,
    ProveedoresComponent,
    ProveedoresContactosComponent,
    ProveedoresProductosComponent,
    ProveedoresServiciosOfrecidosComponent,
    ProveedoresOrdenesComponent,
    ResetPasswordConfirmComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    CommonModule,
    FilterPipe,
    MovimientosComponent,
    LotesComponent,
    ReactiveFormsModule,
    AgotadosComponent,
    FormsModule,
    HttpClientModule

  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

