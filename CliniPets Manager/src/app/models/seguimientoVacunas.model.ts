export interface SeguimientoVacunas {
  IdMascota: string; // ID único de la mascota asociada al registro de vacunas
  IdExpediente: string; // ID del expediente asociado a la hoja de internamiento
  tipoVacuna: string; // Tipo o nombre de la vacuna
  fechaAplicacion: string; // Fecha en que se aplicó la vacuna
  fechaProximaDosis?: string; // Fecha programada para la próxima dosis (opcional)
  observaciones?: string; // Observaciones adicionales sobre la vacunación (opcional)
  estado: 'aplicada' | 'programada' | 'cancelada'; // Estado del registro
  usuarioResponsable: string; // Usuario responsable de registrar o actualizar la información
  fechaUltimaModificacion?: string; // Fecha de la última modificación del registro (opcional)
}
