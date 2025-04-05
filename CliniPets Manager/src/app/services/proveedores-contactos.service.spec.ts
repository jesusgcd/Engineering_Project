import { TestBed } from '@angular/core/testing';

import { ProveedoresContactosService } from './proveedores-contactos.service';

describe('ProveedoresContactosService', () => {
  let service: ProveedoresContactosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoresContactosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
