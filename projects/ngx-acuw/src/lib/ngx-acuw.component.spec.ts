import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAcuwComponent } from './ngx-acuw.component';

describe('NgxAcuwComponent', () => {
  let component: NgxAcuwComponent;
  let fixture: ComponentFixture<NgxAcuwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxAcuwComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxAcuwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
