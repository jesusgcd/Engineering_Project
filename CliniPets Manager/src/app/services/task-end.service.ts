import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Task } from '../models/task.models';

@Injectable({
  providedIn: 'root'
})
export class TaskEndService {

  private collectionName = 'task-end';

  constructor(private firestore: AngularFirestore) {}

  // Obtener tareas finalizadas por usuario
  getCompletedTasksByUser(userId: string): Observable<Task[]> {
    return this.firestore
      .collection<Task>('task-end', (ref) =>
        ref.where('userId', '==', userId).orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((tasks) =>
          tasks.map((task) => ({
            ...task,
            createdAt: (task.createdAt as any).toDate ? (task.createdAt as any).toDate() : task.createdAt,
          }))
        )
      );
  }

  // Agregar una tarea finalizada
  addCompletedTask(task: Task): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionName).doc(id).set({ ...task, id });
  }

  // Eliminar una tarea finalizada
deleteCompletedTask(taskId: string): Promise<void> {
  return this.firestore.collection(this.collectionName).doc(taskId).delete();
}

}
