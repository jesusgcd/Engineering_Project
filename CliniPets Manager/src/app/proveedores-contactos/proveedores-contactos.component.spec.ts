import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresContactosComponent } from './proveedores-contactos.component';

describe('ProveedoresContactosComponent', () => {
  let component: ProveedoresContactosComponent;
  let fixture: ComponentFixture<ProveedoresContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedoresContactosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
