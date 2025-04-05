import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Cita } from '../models/citas.model';
import {Sala} from '../models/salas.model';
import { Especialista } from '../models/especialista.model';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private collectionName = 'citas';

  constructor(private firestore: AngularFirestore) {}

  // Agregar una nueva cita
  agregarCita(cita: Cita) {
    return this.firestore.collection<Cita>(this.collectionName).add(cita);
  }

  // Obtener todas las citas
  obtenerCitas() {
    return this.firestore.collection<Cita>(this.collectionName).snapshotChanges();
  }

  // Actualizar los datos de una cita
  actualizarCita(id: string, cita: Cita) {
    return this.firestore.collection<Cita>(this.collectionName).doc(id).update(cita);
  }

  // Eliminar una cita
  eliminarCita(id: string) {
    return this.firestore.collection<Cita>(this.collectionName).doc(id).delete();
  }






  obtenerEspecialistas() {
    return this.firestore.collection<Especialista>('especialistas').snapshotChanges();
  }


  obtenerSalas() {
    return this.firestore.collection<Sala>('salas').snapshotChanges();
  }


  obtenerCitasPorSala(salaId: string) {
    return this.firestore
      .collection('citas', (ref) => ref.where('salaId', '==', salaId))
      .snapshotChanges();
  }





}
