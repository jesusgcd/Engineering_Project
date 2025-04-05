import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { SeguimientoVacunas } from '../models/seguimientoVacunas.model';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoVacunasService {

  private collectionName = 'SeguimientoVacunas';
  
    constructor(private firestore: AngularFirestore) {}
  

    getVacunasByMascota(idMascota: string): Observable<SeguimientoVacunas[]> {
      return this.firestore
        .collection<SeguimientoVacunas>(this.collectionName, (ref) =>
          ref.where('IdMascota', '==', idMascota)
        )
        .valueChanges({ idField: 'id' });
    }

    getVacunasByExpediente(idExpediente: string): Observable<SeguimientoVacunas[]> {
      return this.firestore
        .collection<SeguimientoVacunas>(this.collectionName, (ref) =>
          ref.where('IdExpediente', '==', idExpediente)
        )
        .valueChanges({ idField: 'id' });
    }

    createVacuna(vacuna: SeguimientoVacunas): Promise<firebase.firestore.DocumentReference> {
      return this.firestore
        .collection<SeguimientoVacunas>(this.collectionName).add(vacuna);
    }
  

    updateVacuna(id: string, data: Partial<SeguimientoVacunas>): Promise<void> {
      return this.firestore
        .collection<SeguimientoVacunas>(this.collectionName)
        .doc(id)
        .update(data);
    }
  
    deleteVacuna(id: string): Promise<void> {
      return this.firestore
        .collection<SeguimientoVacunas>(this.collectionName)
        .doc(id)
        .delete();
    }
}
