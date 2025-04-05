import { TestBed } from '@angular/core/testing';

import { InformesMedicosService } from './informes-medicos.service';

describe('InformesMedicosService', () => {
  let service: InformesMedicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformesMedicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
