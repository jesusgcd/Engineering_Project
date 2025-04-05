import { TestBed } from '@angular/core/testing';

import { AgotadosService } from './agotados.service';

describe('AgotadosService', () => {
  let service: AgotadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgotadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
