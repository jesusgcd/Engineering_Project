import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojasInternamientoComponent } from './hojas-internamiento.component';

describe('HojasInternamientoComponent', () => {
  let component: HojasInternamientoComponent;
  let fixture: ComponentFixture<HojasInternamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HojasInternamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HojasInternamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
