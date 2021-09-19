import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceMonitorDemoComponent } from './performance-monitor.component';

describe('PerformanceMonitorComponent', () => {
  let component: PerformanceMonitorDemoComponent;
  let fixture: ComponentFixture<PerformanceMonitorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceMonitorDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceMonitorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
