import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Mascotas } from '../models/mascotas.models';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private collectionName = 'Mascotas';

  constructor(private firestore: AngularFirestore) {}

  agregarMascota(mascotas: Mascotas): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<Mascotas>(this.collectionName).add(mascotas);
  }

  obtenerMascota() {
    return this.firestore.collection<Mascotas>(this.collectionName).snapshotChanges();
  }

  eliminarMascota(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  actualizarMascotasss(id: string, mascotas: Mascotas) {
    return this.firestore.collection('Mascotas').doc(id).update(mascotas);
  }

  actualizarMascota(id: string, mascota: Mascotas) {
    return this.firestore
      .collection('Mascotas')
      .doc(id)
      .update(mascota);
  }

  actualizarMascotass(id: string, mascota: Mascotas) {
      return this.firestore.collection<Mascotas>(this.collectionName).doc(id).update(mascota);
    }

  obtenerMascotaPorId(id: string) {
    return this.firestore.collection<Mascotas>(this.collectionName).doc(id).valueChanges();
  }


}
