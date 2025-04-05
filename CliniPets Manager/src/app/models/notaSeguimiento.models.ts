export interface NotaSeguimiento {
  IdMascota: string; // ID de la mascota asociada a la hoja de internamiento
  IdExpediente: string; // ID del expediente asociado a la hoja de internamiento
  fechaCreacion: string;
  observaciones: string;
  estado: 'activa' | 'archivada';
  usuarioCreador: string; // ID del usuario que registró la hoja de internamiento
  fechaUltimaModificacion?: string; // Fecha y hora de la última modificación (opcional)
}
