import { TestBed } from '@angular/core/testing';

import { HojasInternamientoService } from './hojas-internamiento.service';

describe('HojasInternamientoService', () => {
  let service: HojasInternamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HojasInternamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
