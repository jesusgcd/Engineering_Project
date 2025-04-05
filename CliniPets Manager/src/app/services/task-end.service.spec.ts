import { TestBed } from '@angular/core/testing';

import { TaskEndService } from './task-end.service';

describe('TaskEndService', () => {
  let service: TaskEndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
