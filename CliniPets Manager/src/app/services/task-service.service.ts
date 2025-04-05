import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.models';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  private collectionName = 'tasks';

  constructor(private firestore: AngularFirestore) {}

  // Obtener tareas por usuario
  getTasksByUser(userId: string): Observable<Task[]> {
    return this.firestore
      .collection<Task>(this.collectionName, (ref) =>
        ref.where('userId', '==', userId).orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  // Agregar una nueva tarea
  addTask(task: Task): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ ...task, id });
  }

  // Actualizar tarea
  updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(taskId).update(task);
  }

  // Eliminar tarea
  deleteTask(taskId: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(taskId).delete();
  }
}
