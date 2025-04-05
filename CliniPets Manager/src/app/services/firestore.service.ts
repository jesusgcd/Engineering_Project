import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  //Funcion que crea el documento en firestore
createDoc(data: any, path:string, id: string){
  const colection = this.firestore.collection(path);
  return colection.doc(id).set(data);

}
}

