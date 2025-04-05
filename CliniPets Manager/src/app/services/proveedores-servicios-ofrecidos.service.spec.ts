import { TestBed } from '@angular/core/testing';

import { ProveedoresServiciosOfrecidosService } from './proveedores-servicios-ofrecidos.service';

describe('ProveedoresServiciosOfrecidosService', () => {
  let service: ProveedoresServiciosOfrecidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoresServiciosOfrecidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
