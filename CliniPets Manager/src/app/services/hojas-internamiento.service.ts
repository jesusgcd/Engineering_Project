import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { HojaInternamiento } from '../models/hojaInternamiento.models';

@Injectable({
  providedIn: 'root',
})
export class HojasInternamientoService {
  private collectionName = 'HojasInternamiento';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtiene todas las hojas de internamiento asociadas a un IdMascota
   * @param idMascota ID de la mascota
   * @returns Observable con las hojas de internamiento
   */
  getHojasByMascota(idMascota: string): Observable<HojaInternamiento[]> {
    return this.firestore
      .collection<HojaInternamiento>(this.collectionName, (ref) =>
        ref.where('IdMascota', '==', idMascota)
      )
      .valueChanges({ idField: 'id' });
  }

  /**
   * Obtiene todas las hojas de internamiento asociadas a un IdExpediente
   * @param idExpediente ID del expediente
   * @returns Observable con las hojas de internamiento
   */
  getHojasByExpediente(idExpediente: string): Observable<HojaInternamiento[]> {
    return this.firestore
      .collection<HojaInternamiento>(this.collectionName, (ref) =>
        ref.where('IdExpediente', '==', idExpediente)
      )
      .valueChanges({ idField: 'id' });
  }

  /**
   * Crea una nueva hoja de internamiento
   * @param hoja Datos de la hoja de internamiento a crear
   * @returns Promesa al guardar la hoja
   */
  createHoja(hoja: HojaInternamiento): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore
      .collection<HojaInternamiento>(this.collectionName)
      .doc(id)
      .set({ ...hoja});
  }

  /**
   * Actualiza una hoja de internamiento existente
   * @param id ID de la hoja a actualizar
   * @param data Datos actualizados
   * @returns Promesa al actualizar la hoja
   */
  updateHoja(id: string, data: Partial<HojaInternamiento>): Promise<void> {
    return this.firestore
      .collection<HojaInternamiento>(this.collectionName)
      .doc(id)
      .update(data);
  }

  /**
   * Elimina una hoja de internamiento
   * @param id ID de la hoja a eliminar
   * @returns Promesa al eliminar la hoja
   */
  deleteHoja(id: string): Promise<void> {
    return this.firestore
      .collection<HojaInternamiento>(this.collectionName)
      .doc(id)
      .delete();
  }
}
