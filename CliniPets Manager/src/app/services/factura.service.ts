import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Factura } from '../models/factura.model';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private collectionName = 'facturas';

  constructor(private firestore: AngularFirestore) {}

  // Agregar una nueva factura
  agregarFactura(factura: Factura) {
    return this.firestore.collection<Factura>(this.collectionName).add(factura);
  }

  // Obtener todas las facturas
  obtenerFacturas() {
    return this.firestore.collection<Factura>(this.collectionName).snapshotChanges();
  }

  // Actualizar una factura existente
  actualizarFactura(id: string, factura: Factura) {
    return this.firestore.collection(this.collectionName).doc(id).update(factura);
  }

  // Eliminar una factura
  eliminarFactura(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
