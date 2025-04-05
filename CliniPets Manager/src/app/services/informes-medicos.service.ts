import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { InformeMedico } from '../models/informeMedico.model';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root',
})
export class InformesMedicosService {
  private collectionName = 'InformesMedicos';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtiene todos los informes médicos asociados a un IdMascota
   * @param idMascota ID de la mascota
   * @returns Observable con los informes médicos
   */
  getInformesByMascota(idMascota: string): Observable<InformeMedico[]> {
    return this.firestore
      .collection<InformeMedico>(this.collectionName, (ref) =>
        ref.where('idMascota', '==', idMascota)
      )
      .valueChanges({ idField: 'id' });
  }

  /**
   * Obtiene todos los informes médicos asociados a un IdExpediente
   * @param idExpediente ID del expediente
   * @returns Observable con los informes médicos
   */
  getInformesByExpediente(idExpediente: string): Observable<InformeMedico[]> {
    return this.firestore
      .collection<InformeMedico>(this.collectionName, (ref) =>
        ref.where('idExpediente', '==', idExpediente)
      )
      .valueChanges({ idField: 'id' });
  }

  /**
   * Crea un nuevo informe médico
   * @param informe Datos del informe médico a crear
   * @returns Promesa al guardar el informe
   */
  createInforme(informe: InformeMedico): Promise<firebase.firestore.DocumentReference> {
    return this.firestore
      .collection<InformeMedico>(this.collectionName).add(informe);
  }

  //this.firestore.collection<Expediente>(this.collectionName).add(expediente);

  /**
   * Actualiza un informe médico existente
   * @param id ID del informe a actualizar
   * @param data Datos actualizados
   * @returns Promesa al actualizar el informe
   */
  updateInforme(id: string, data: Partial<InformeMedico>): Promise<void> {
    return this.firestore
      .collection<InformeMedico>(this.collectionName)
      .doc(id)
      .update(data);
  }

  /**
   * Elimina un informe médico
   * @param id ID del informe a eliminar
   * @returns Promesa al eliminar el informe
   */
  deleteInforme(id: string): Promise<void> {
    return this.firestore
      .collection<InformeMedico>(this.collectionName)
      .doc(id)
      .delete();
  }
}