import { TestBed } from '@angular/core/testing';

import { ProveedoresOrdenesService } from './proveedores-ordenes.service';

describe('ProveedoresOrdenesService', () => {
  let service: ProveedoresOrdenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoresOrdenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
