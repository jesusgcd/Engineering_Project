import { TestBed } from '@angular/core/testing';

import { SeguimientoVacunasService } from './seguimiento-vacunas.service';

describe('SeguimientoVacunasService', () => {
  let service: SeguimientoVacunasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoVacunasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
