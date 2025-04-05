export interface Mascotas {
  documentId?: string;
  nombreMascota: string;
  sexo: 'Macho' | 'Hembra';
  raza?: {
    uid: string;
    nombre: string;
    especie: string;
  }; // Información completa de la raza
  especie: string;
  tipoSangre?: string;
  fechaNacimiento: Date;
  pesoActual?: number;
  cedula: string;
  nombreDueno: string;
  contactoDueno: {
    telefono: string;
    correo: string;
  };
  detallesExtra?: string;
  fechaRegistro: Date;
  estatusActividad: 'Activa' | 'Inactiva';
}
