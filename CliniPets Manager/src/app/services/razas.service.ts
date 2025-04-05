import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RazaMascota } from '../models/razas.model';
import { map, Observable } from 'rxjs';

export interface Raza {
  uid: string;
  nombre: string;
  especie: string;
}

@Injectable({
  providedIn: 'root',
})
export class RazasService {
  private collectionName = 'razas';

  constructor(private firestore: AngularFirestore) {}

  obtenerRazas2(): Observable<Raza[]> {
    return this.firestore
      .collection('razas')
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => {
            const data = c.payload.doc.data() as Raza;
            return { ...data, uid: c.payload.doc.id }; // Sobrescribe el uid con el del documento
          })
        )
      );
  }

  agregarRaza(raza: RazaMascota) {
    raza.fechaRegistro = new Date();
    return this.firestore.collection<RazaMascota>(this.collectionName).add(raza);
  }


  obtenerRazas() {
    return this.firestore.collection<RazaMascota>(this.collectionName).snapshotChanges();
  }

  actualizarRaza(id: string, raza: RazaMascota) {
    return this.firestore.collection<RazaMascota>(this.collectionName).doc(id).update(raza);
  }

  eliminarRaza(id: string) {
    return this.firestore.collection<RazaMascota>(this.collectionName).doc(id).delete();
  }
}
