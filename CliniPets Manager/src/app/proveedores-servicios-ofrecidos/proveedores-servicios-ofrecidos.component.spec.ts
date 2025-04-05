import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresServiciosOfrecidosComponent } from './proveedores-servicios-ofrecidos.component';

describe('ProveedoresServiciosOfrecidosComponent', () => {
  let component: ProveedoresServiciosOfrecidosComponent;
  let fixture: ComponentFixture<ProveedoresServiciosOfrecidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedoresServiciosOfrecidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresServiciosOfrecidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
