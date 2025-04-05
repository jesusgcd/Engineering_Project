import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresOrdenesComponent } from './proveedores-ordenes.component';

describe('ProveedoresOrdenesComponent', () => {
  let component: ProveedoresOrdenesComponent;
  let fixture: ComponentFixture<ProveedoresOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedoresOrdenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
