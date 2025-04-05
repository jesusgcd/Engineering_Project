export interface HojaInternamiento {
  IdMascota: string; // ID de la mascota asociada a la hoja de internamiento
  IdExpediente: string; // ID del expediente asociado a la hoja de internamiento
  fechaIngreso: string; // Fecha de ingreso de la mascota (en formato string para compatibilidad)
  fechaEgreso?: string; // Fecha de egreso de la mascota (opcional)
  diagnostico: string; // Diagnóstico detallado de la mascota
  tratamiento: string; // Tratamiento administrado durante el internamiento
  observaciones?: string; // Observaciones adicionales (opcional)
  estado: 'Activo' | 'Egresado'; // Estado del internamiento (Activo mientras esté internado)
  usuarioCreador: string; // ID del usuario que registró la hoja de internamiento
  fechaUltimaModificacion?: string; // Fecha y hora de la última modificación (opcional)
}
