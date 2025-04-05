import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Especialista } from '../models/especialista.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EspecialistaService {
  private collectionName = 'especialistas';

  constructor(private firestore: AngularFirestore) {}

  agregarEspecialista(especialista: Especialista) {
    return this.firestore.collection<Especialista>(this.collectionName).add(especialista);
  }

  // Obtener todos los especialistas
  obtenerEspecialistas() {
    return this.firestore.collection<Especialista>(this.collectionName).snapshotChanges();
  }

  obtenerEspecialistasParaSelector() {
    return this.firestore.collection<Especialista>(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Especialista;
          const id = a.payload.doc.id;
          return { id, ...data }; // Devuelve el id y los datos combinados
        }))
      );
  }

  // Actualizar los datos de un especialista
  actualizarEspecialista(id: string, especialista: Especialista) {
    return this.firestore.collection<Especialista>(this.collectionName).doc(id).update(especialista);
  }

  // Eliminar un especialista
  eliminarEspecialista(id: string) {
    return this.firestore.collection<Especialista>(this.collectionName).doc(id).delete();
  }
}
