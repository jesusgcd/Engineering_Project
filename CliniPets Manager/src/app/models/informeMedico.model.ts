export interface InformeMedico {
    idMascota: string; // ID de la mascota asociada al informe
    idExpediente: string; // ID del expediente asociado
    fechaCreacion: string; // Fecha en que se generó el informe
    fechaUltimaModificacion?: string; // Fecha de la última modificación del informe (opcional)
    diagnosticos: string; // Lista de diagnósticos realizados
    tratamientos: string; // Lista de tratamientos aplicados
    observaciones?: string; // Observaciones adicionales del informe (opcional)
    estado: 'activo' | 'archivado'; // Estado del informe (por ejemplo, activo o archivado)
    usuarioCreador: string; // usuario que creó el informe
  }
  
