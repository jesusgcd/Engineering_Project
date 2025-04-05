import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListHechoComponent } from './to-do-list-hecho.component';

describe('ToDoListHechoComponent', () => {
  let component: ToDoListHechoComponent;
  let fixture: ComponentFixture<ToDoListHechoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToDoListHechoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoListHechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
