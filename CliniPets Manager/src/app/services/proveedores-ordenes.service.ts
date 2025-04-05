import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProveedoresContactos } from '../models/proveedoresContactos.model';
import firebase from 'firebase/compat/app';
import { ProveedoresOrdenes } from '../models/proveedoresOrdenes';

@Injectable({
  providedIn: 'root'
})

export class ProveedoresOrdenesService {
  private collectionName = 'ProveedoresOrdenes';
  constructor(private firestore: AngularFirestore) { }


  // agregarProveedorContacto
  agregarProveedorOrden(proveedorOrden: ProveedoresOrdenes): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<ProveedoresOrdenes>(this.collectionName).add(proveedorOrden);
  }
  // obtenerProveedorOrden
  obtenerProveedorOrden() {
    return this.firestore.collection<ProveedoresOrdenes>(this.collectionName).snapshotChanges();
  }
  // actualizarProveedorOrden
  actualizarProveedorOrden(id: string, proveedorOrden: ProveedoresOrdenes) {
    return this.firestore.collection(this.collectionName).doc(id).update(proveedorOrden);
  }
  // eliminarProveedorOrden
  eliminarProveedorOrden(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

}
