import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazasMascotasComponent } from './razas-mascotas.component';

describe('RazasMascotasComponent', () => {
  let component: RazasMascotasComponent;
  let fixture: ComponentFixture<RazasMascotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RazasMascotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RazasMascotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
