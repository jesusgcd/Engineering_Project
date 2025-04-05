import { TestBed } from '@angular/core/testing';

import { NotasSeguimientoService } from './notas-seguimiento.service';

describe('NotasSeguimientoService', () => {
  let service: NotasSeguimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasSeguimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
