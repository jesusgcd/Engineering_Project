import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresProductosService {

  constructor(private firestore: AngularFirestore) { }
  private collectionName = 'ProveedoresProductos';

    // agregarProveedorProducto
    agregarProveedorProducto(proveedorProducto: any): Promise<firebase.firestore.DocumentReference> {
      return this.firestore.collection<any>(this.collectionName).add(proveedorProducto);
    }
    // obtenerProveedorProducto
    obtenerProveedorProducto() {
      return this.firestore.collection<any>(this.collectionName).snapshotChanges();
    }
    // actualizarProveedorProducto
    actualizarProveedorProducto(id: string, proveedorProducto: any) {
      return this.firestore.collection(this.collectionName).doc(id).update(proveedorProducto);
    }
    // eliminarProveedorProducto
    eliminarProveedorProducto(id: string) {
      return this.firestore.collection(this.collectionName).doc(id).delete();
    }
}
