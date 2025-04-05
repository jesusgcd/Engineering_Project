import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesMedicosComponent } from './informes-medicos.component';

describe('InformesMedicosComponent', () => {
  let component: InformesMedicosComponent;
  let fixture: ComponentFixture<InformesMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformesMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformesMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
