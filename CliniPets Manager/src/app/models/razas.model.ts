export interface RazaMascota {
  uid?: string; // ID único opcional (puede ser generado por la base de datos)
  nombre: string; // Nombre de la raza
  especie: string; // Especie (Perro, Gato, etc.)
  tamano: string; // Tamaño promedio (Pequeño, Mediano, Grande)
  pesoPromedio?: string; // Peso promedio en kg (opcional)
  esperanzaVida?: string; // Esperanza de vida en años (opcional)
  colorTipico?: string; // Colores comunes del pelaje (opcional)
  tipoPelaje?: string; // Tipo de pelaje (Corto, Largo, Rizado)
  alturaPromedio?: string; // Altura promedio en cm (opcional)
  temperamento?: string; // Temperamento típico de la raza
  nivelEnergia?: string; // Nivel de energía (Bajo, Medio, Alto)
  inteligencia?: string; // Nivel de inteligencia
  cuidadosEspeciales?: string; // Información sobre cuidados específicos
  paisOrigen?: string; // País de origen de la raza
  popularidad?: string; // Popularidad de la raza (Alta, Media, Baja)
  fechaRegistro?: Date; // Fecha de registro en el sistema
  notasAdicionales?: string; // Información adicional o comentarios
}
