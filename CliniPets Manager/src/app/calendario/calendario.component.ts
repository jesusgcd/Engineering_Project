import { Component, OnInit } from '@angular/core';
import { CitasService } from '../services/citas.service';
import { Cita } from '../models/citas.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  standalone: false,
})
export class CalendarioComponent implements OnInit {
  citas: Cita[] = [];
  citasPorDia: { [key: string]: Cita[] } = {};

  diasSemana: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  horas: string[] = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.citasService
      .obtenerCitas()
      .pipe(
        map((data) =>
          data.map((e) => ({
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Cita),
          }))
        )
      )
      .subscribe(
        (citas: Cita[]) => {
          this.citas = citas;
          this.filtrarCitasSemanaActual();
        },
        (error) => {
          console.error('Error al obtener citas:', error);
        }
      );
  }

  filtrarCitasSemanaActual(): void {
    this.citasPorDia = this.diasSemana.reduce((acc: { [key: string]: Cita[] }, dia: string) => {
      acc[dia] = [];
      return acc;
    }, {});

    const inicioSemana = this.obtenerInicioSemana(new Date());
    const finSemana = this.obtenerFinSemana(new Date());

    inicioSemana.setHours(12, 0, 0, 0);
    finSemana.setHours(12, 0, 0, 0);

    this.citas.forEach((cita) => {
      const fechaCita = new Date(cita.fecha + 'T00:00:00');
      fechaCita.setHours(12, 0, 0, 0);

      if (isNaN(fechaCita.getTime())) {
        return;
      }

      const diaSemana = fechaCita.getDay();
      const diaAjustado = (diaSemana + 6) % 7;
      const nombreDia = this.diasSemana[diaAjustado];

      if (diaAjustado === 7) {
        return;
      }

      if (fechaCita >= inicioSemana && fechaCita <= finSemana) {
        this.citasPorDia[nombreDia].push(cita);
      }
    });
  }

  obtenerInicioSemana(fecha: Date): Date {
    const dia = fecha.getDay();
    const diferencia = dia === 0 ? -6 : 1 - dia;
    const inicio = new Date(fecha);
    inicio.setDate(fecha.getDate() + diferencia);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  }

  obtenerFinSemana(fecha: Date): Date {
    const dia = fecha.getDay();
    const diferencia = dia === 0 ? 5 : 6 - dia;
    const fin = new Date(fecha);
    fin.setDate(fecha.getDate() + diferencia);
    fin.setHours(23, 59, 59, 999);
    return fin;
  }

  getGridRow(hora: string): number {
    const [hour, minute] = hora.split(':').map(Number);
    return hour - 7 + 1;
  }
}
