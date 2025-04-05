import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProveedoresContactos } from '../models/proveedoresContactos.model';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresContactosService {
  private collectionName = 'ProveedoresContactos';
  constructor(private firestore: AngularFirestore) { }

  // agregarProveedorContacto
  agregarProveedorContacto(proveedorContacto: ProveedoresContactos): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<ProveedoresContactos>(this.collectionName).add(proveedorContacto);
  }
  // obtenerProveedorContacto
  obtenerProveedorContacto() {
    return this.firestore.collection<ProveedoresContactos>(this.collectionName).snapshotChanges();
  }
  // actualizarProveedorContacto
  actualizarProveedorContacto(id: string, proveedorContacto: ProveedoresContactos) {
    return this.firestore.collection(this.collectionName).doc(id).update(proveedorContacto);
  }
  // eliminarProveedorContacto
  eliminarProveedorContacto(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}




