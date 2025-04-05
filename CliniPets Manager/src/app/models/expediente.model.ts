export interface Expediente {
  idMascota: string; // Identificador único de la mascota
  nombreMascota: string; // Nombre de la mascota
  sexo: string; // Género de la mascota
  nombreDueno: string; // Nombre del dueño
  cedulaDueno: string; // ID del dueño
  fechaCreacionExpediente: string; // Fecha de creación del expediente
  estatusActividad: 'Activo' | 'Inactivo'; // Estatus de la mascota
}
