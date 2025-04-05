import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { NotaSeguimiento } from '../models/notaSeguimiento.models';

@Injectable({
  providedIn: 'root',
})
export class NotasSeguimientoService {
  private collectionName = 'NotasSeguimiento';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtiene todas las notas de seguimiento asociadas a un IdMascota.
   * @param idMascota ID de la mascota.
   * @returns Observable con las notas de seguimiento.
   */
  getNotasByMascota(idMascota: string): Observable<NotaSeguimiento[]> {
    return this.firestore
      .collection<NotaSeguimiento>(this.collectionName, (ref) =>
        ref.where('IdMascota', '==', idMascota)
      )
      .valueChanges({ idField: 'id' });
  }

  /**
   * Obtiene todas las notas de seguimiento asociadas a un IdExpediente.
   * @param idExpediente ID del expediente.
   * @returns Observable con las notas de seguimiento.
   */
  getNotasByExpediente(idExpediente: string): Observable<NotaSeguimiento[]> {
    return this.firestore
      .collection<NotaSeguimiento>(this.collectionName, (ref) =>
        ref.where('IdExpediente', '==', idExpediente)
      )
      .valueChanges({ idField: 'id' });
  }

  /**
   * Crea una nueva nota de seguimiento.
   * @param nota Datos de la nota de seguimiento a crear.
   * @returns Promesa al guardar la nota.
   */
  createNota(nota: NotaSeguimiento): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore
      .collection<NotaSeguimiento>(this.collectionName)
      .doc(id)
      .set({ ...nota });
  }

  /**
   * Actualiza una nota de seguimiento existente.
   * @param id ID de la nota a actualizar.
   * @param data Datos actualizados.
   * @returns Promesa al actualizar la nota.
   */
  updateNota(id: string, data: Partial<NotaSeguimiento>): Promise<void> {
    return this.firestore
      .collection<NotaSeguimiento>(this.collectionName)
      .doc(id)
      .update(data);
  }

  /**
   * Elimina una nota de seguimiento.
   * @param id ID de la nota a eliminar.
   * @returns Promesa al eliminar la nota.
   */
  deleteNota(id: string): Promise<void> {
    return this.firestore
      .collection<NotaSeguimiento>(this.collectionName)
      .doc(id)
      .delete();
  }
}
