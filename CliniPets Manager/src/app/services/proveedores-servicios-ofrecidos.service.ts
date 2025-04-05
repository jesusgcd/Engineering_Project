import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { ProveedoresServiciosOfrecidos } from '../models/proveedoresServiciosOfrecidos.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresServiciosOfrecidosService {

  private collectionName = 'ProveedoresServiciosOfrecidos';
  constructor(private firestore: AngularFirestore) { }

  // agregarProveedorContacto
  agregarProveedorServicioOfrecido(proveedorServicioOfrecido: ProveedoresServiciosOfrecidos): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<ProveedoresServiciosOfrecidos>(this.collectionName).add(proveedorServicioOfrecido);
  }
  // obtenerProveedorServicioOfrecido
  obtenerProveedorServicioOfrecido() {
    return this.firestore.collection<ProveedoresServiciosOfrecidos>(this.collectionName).snapshotChanges();
  }
  // actualizarProveedorServicioOfrecido
  actualizarProveedorServicioOfrecido(id: string, proveedorServicioOfrecido: ProveedoresServiciosOfrecidos) {
    return this.firestore.collection(this.collectionName).doc(id).update(proveedorServicioOfrecido);
  }
  // eliminarProveedorServicioOfrecido
  eliminarProveedorServicioOfrecido(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
