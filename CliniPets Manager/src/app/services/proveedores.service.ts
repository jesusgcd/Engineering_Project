import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Proveedores } from '../models/proveedores.model';
import firebase from 'firebase/compat/app';

export interface ProveedoresServiceInterface {

  nombreProveedor: string;

}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private collectionName = 'Proveedores';

  constructor(private firestore: AngularFirestore) { }


  // agregarProveedor
  agregarProveedor(proveedores: Proveedores): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<Proveedores>(this.collectionName).add(proveedores);
  }

  // obtenerProveedor
  obtenerProveedor() {
    return this.firestore.collection<Proveedores>(this.collectionName).snapshotChanges();
  }

  // actualizarProveedor
  actualizarProveedor(id: string, proveedor: Proveedores) {
    return this.firestore.collection('Proveedores').doc(id).update(proveedor);
  }

  // eliminarProveedor
  eliminarProveedor(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }



}
