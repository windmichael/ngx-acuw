import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartjsTestComponent } from './chartjs-test.component';

describe('ChartjsTestComponent', () => {
  let component: ChartjsTestComponent;
  let fixture: ComponentFixture<ChartjsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartjsTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartjsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
