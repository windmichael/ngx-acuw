import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PerformanceMonitorComponent } from './performance-monitor.component';

describe('PerformanceMonitorComponent', () => {
  let component: PerformanceMonitorComponent;
  let fixture: ComponentFixture<PerformanceMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 0 fps after created', () => {
    fixture.detectChanges();
    const elem = fixture.debugElement.query(By.css('#fps-display')).nativeElement as HTMLDivElement;
    expect(elem.textContent).toEqual(0 + ' FPS');
  });

  it('should calculate the correct fps', fakeAsync(() => {
    // Simulate animation with 10 fps
    for(let idx = 0; idx <= 11; idx ++){
      tick(100);
      component.end();
    }

    expect(component.fps).toEqual(10);
    const elem = fixture.debugElement.query(By.css('#fps-display')).nativeElement as HTMLDivElement;
    expect(elem.textContent).toEqual(10 + ' FPS');
  }));
});
