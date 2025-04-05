import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../services/factura.service';
import { Factura } from '../models/factura.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
  standalone: false,
})
export class FacturasComponent implements OnInit {
  factura: Factura = { numeroFactura: '', cliente: '', fecha: new Date(), notas: '', total: 0, estado: '' };

  facturas: Factura[] = [];
  filtro: string = '';
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  modoEdicion: boolean = false;
  facturaId: string | null = null;

  facturaAEliminarId: string | null = null;
  mostrarModal: boolean = false;
  modalEliminarMessage: string = '';

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.facturaService
      .obtenerFacturas()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Factura),
          }))
        )
      )
      .subscribe(
        (facturas: Factura[]) => {
          this.facturas = facturas;
        },
        (error) => {
          console.error('Error al obtener facturas:', error);
        }
      );
  }

  editarFactura(factura: Factura) {
    this.factura = { ...factura };
    this.modoEdicion = true;
    this.facturaId = factura.id || null;
    this.mostrarFormulario = true;
  }

  guardarFactura() {
    if (this.modoEdicion && this.facturaId) {
      this.facturaService
        .actualizarFactura(this.facturaId, this.factura)
        .then(() => {
          this.mensajeExito = true;
          setTimeout(() => (this.mensajeExito = false), 5000);
          this.cerrarFormulario();
        })
        .catch((error) => console.error('Error al actualizar factura:', error));
    } else {
      this.facturaService.agregarFactura(this.factura).then(() => {
        this.mensajeExito = true;
        setTimeout(() => (this.mensajeExito = false), 5000);
        this.factura = { numeroFactura: '', cliente: '', fecha: new Date(), notas: '', total: 0, estado: ''};

        this.cerrarFormulario();
      });
    }
  }

  confirmarEliminacionFactura(confirmar: boolean) {
    if (confirmar && this.facturaAEliminarId) {
      this.facturaService.eliminarFactura(this.facturaAEliminarId)
        .then(() => {

          this.facturas = this.facturas.filter(c => c.id !== this.facturaAEliminarId);
        })
        .catch((error) => {
          console.error('Error la factura el especialista de Firestore:', error);
        });
    }
    this.mostrarModal = false;
  }


  eliminarFactura(id: string) {
    this.facturaAEliminarId = id;
    console.log('ID de la factura a eliminar:', id);
    this.modalEliminarMessage = `¿Está seguro de que desea eliminar la factura?`;
    this.mostrarModal = true;
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.factura = { numeroFactura: '', cliente: '', fecha: new Date(), notas: '', total: 0, estado: ''};

  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }
}
