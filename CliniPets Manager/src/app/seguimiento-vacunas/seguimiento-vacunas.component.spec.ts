import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoVacunasComponent } from './seguimiento-vacunas.component';

describe('SeguimientoVacunasComponent', () => {
  let component: SeguimientoVacunasComponent;
  let fixture: ComponentFixture<SeguimientoVacunasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeguimientoVacunasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoVacunasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
