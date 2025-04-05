import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Lote } from '../models/lotes.model';

@Injectable({
  providedIn: 'root', // Esto asegura que Angular registre automáticamente el servicio
})
export class LotesService {
  private collectionName = 'lotes';

  constructor(private firestore: AngularFirestore) {}

  agregarLote(lote: Lote) {
    return this.firestore.collection(this.collectionName).add(lote);
  }
  obtenerLotes() {
    return this.firestore.collection<Lote>(this.collectionName).snapshotChanges();
  }

  actualizarStock(id: string, nuevoStock: number) {
    return this.firestore.collection(this.collectionName).doc(id).update({ stock: nuevoStock });
  }
  actualizarLote(id: string, lote: Lote) {
    return this.firestore.collection('lotes').doc(id).update(lote);
  }

  eliminarLote(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  
}
