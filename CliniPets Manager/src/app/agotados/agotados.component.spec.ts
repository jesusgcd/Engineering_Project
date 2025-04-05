import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgotadosComponent } from './agotados.component';

describe('AgotadosComponent', () => {
  let component: AgotadosComponent;
  let fixture: ComponentFixture<AgotadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgotadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgotadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
