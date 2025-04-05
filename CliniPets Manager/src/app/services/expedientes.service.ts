import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Expediente } from '../models/expediente.model';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class ExpedientesService {
  private collectionName = 'Expedientes';

  constructor(private firestore: AngularFirestore) {}

  // Método para agregar un expediente
  agregarExpediente(expediente: Expediente): Promise<firebase.firestore.DocumentReference> {
    return this.firestore.collection<Expediente>(this.collectionName).add(expediente);
  }

  // Método para obtener todos los expedientes
  obtenerExpedientes() {
    return this.firestore.collection<Expediente>(this.collectionName, ref => ref.where('estatusActividad', '==', 'Activo')).snapshotChanges();
  }

  // Método para eliminar un expediente, solo cambia el estatus de la mascota a 'Inactivo'
  eliminarExpediente(id: string): Promise<void> {
    return this.firestore.collection<Expediente>(this.collectionName).doc(id).update({ estatusActividad: 'Inactivo' });
  }

  // Método para obtener un expediente por su ID
  obtenerExpedientePorMascota(idMascota: string) {
    return this.firestore.collection<Expediente>(this.collectionName, ref => ref.where('uidMascota', '==', idMascota)).snapshotChanges();
  }

  // Método para obtener un expediente por su ID, retorna un objeto de tipo Expediente
  obtenerExpedientePorId(id: string) {
    return this.firestore.collection<Expediente>(this.collectionName).doc(id).valueChanges();
  }
  

}
