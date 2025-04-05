import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Sala } from '../models/salas.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SalasService {
  private collectionName = 'salas';

  constructor(private firestore: AngularFirestore) {}

  agregarSala(sala: Sala) {
    return this.firestore.collection<Sala>(this.collectionName).add(sala);
  }

  obtenerSalas() {
    return this.firestore.collection<Sala>(this.collectionName).snapshotChanges();
  }

  obtenerSalasParaSelector() {
    return this.firestore.collection<Sala>('salas')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Sala;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  actualizarSala(id: string, sala: Sala) {
    return this.firestore.collection(this.collectionName).doc(id).update(sala);
  }

  eliminarSala(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
