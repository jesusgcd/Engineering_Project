import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasSeguimientoComponent } from './notas-seguimiento.component';

describe('NotasSeguimientoComponent', () => {
  let component: NotasSeguimientoComponent;
  let fixture: ComponentFixture<NotasSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasSeguimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
