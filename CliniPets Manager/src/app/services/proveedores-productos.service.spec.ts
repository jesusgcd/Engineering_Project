import { TestBed } from '@angular/core/testing';

import { ProveedoresProductosService } from './proveedores-productos.service';

describe('ProveedoresProductosService', () => {
  let service: ProveedoresProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoresProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
