import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesExpedienteComponent } from './detalles-expediente.component';

describe('DetallesExpedienteComponent', () => {
  let component: DetallesExpedienteComponent;
  let fixture: ComponentFixture<DetallesExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetallesExpedienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
