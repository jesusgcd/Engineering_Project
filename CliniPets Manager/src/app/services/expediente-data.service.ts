import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible globalmente
})
export class ExpedienteDataService {
  private idExpedienteSource = new BehaviorSubject<string | null>(null); // Inicializa con null
  private idMascotaSource = new BehaviorSubject<string | null>(null); // Inicializa con null
  currentIdExpediente = this.idExpedienteSource.asObservable(); // Observable para suscribirse
  currentIdMascota = this.idMascotaSource.asObservable(); // Observable para suscribirse

  // Método para actualizar el ID de la Expediente
  changeIdExpediente(idExpedienteSource: string, idMascotaSource: string): void {
    this.idExpedienteSource.next(idExpedienteSource);
    this.idMascotaSource.next(idMascotaSource);
  }

  // metodo para optener el id de la expediente
  getIdExpediente(): string | null {
    return this.idExpedienteSource.getValue();
  }

  // Método para obtener el ID de la mascota
  getIdMascota(): string | null {
    return this.idMascotaSource.getValue();
  }
}
