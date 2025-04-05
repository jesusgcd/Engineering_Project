import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Movimiento } from '../models/movimientos.model';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private collectionName = 'movimientos';

  constructor(private firestore: AngularFirestore) {}

  // Agregar un nuevo movimiento
  agregarMovimiento(movimiento: Movimiento) {
    return this.firestore.collection<Movimiento>(this.collectionName).add(movimiento);
  }

  // Obtener todos los movimientos
  obtenerMovimientos() {
    return this.firestore.collection<Movimiento>(this.collectionName).snapshotChanges();
  }

  // Actualizar un movimiento
  actualizarMovimiento(id: string, movimiento: Movimiento) {
    return this.firestore.collection(this.collectionName).doc(id).update(movimiento);
  }

  // Eliminar un movimiento
  eliminarMovimiento(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }


}
