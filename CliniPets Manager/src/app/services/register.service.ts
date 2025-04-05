import { Injectable } from '@angular/core';
import { userI } from '../../interface/register.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EncryptionService } from './encryption.service';
import { UserCredential } from 'firebase/auth';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore,
    private encryptionService: EncryptionService){

  }

registrarUser(datos: userI): Promise<firebase.auth.UserCredential> {
  return this.auth.currentUser
    .then(async (adminUser) => {
      if (!adminUser) {
        throw new Error('No hay un administrador autenticado.');
      }

      // Registrar al nuevo usuario
      const userCredential = await this.auth.createUserWithEmailAndPassword(datos.correo, datos.password);

      // Cerrar sesión del nuevo usuario
      await this.auth.signOut();

      // Recuperar credenciales del administrador desde Firestore
      const adminSnapshot = await this.firestore.collection('Usuarios', ref =>
        ref.where('correo', '==', adminUser.email)
      ).get().toPromise();

      if (!adminSnapshot || adminSnapshot.empty) {
        throw new Error('No se encontraron credenciales del administrador en Firestore.');
      }

      const adminData: any = adminSnapshot.docs[0].data();
      const adminPassword = this.encryptionService.decrypt(adminData.password);

      // Restaurar la sesión del administrador
      await this.auth.signInWithEmailAndPassword(adminUser.email!, adminPassword);
      console.log('Sesión del administrador restaurada correctamente.');

      // Retornar las credenciales del usuario creado
      return userCredential;
    })
    .catch((error) => {
      console.error('Error durante el registro o restauración de sesión:', error);
      throw error;
    });
}





}
