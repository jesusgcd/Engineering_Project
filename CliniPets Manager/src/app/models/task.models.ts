export interface Task {
  id?: string; // ID generado por Firestore
  userId: string; // UID del usuario
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo' | 'Finalizado'; // Estado de la tarea
  createdAt: Date;
}
