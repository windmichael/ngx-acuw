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

  it('should not show any fps after created', () => {
    fixture.detectChanges();
    const elem = fixture.debugElement.query(By.css('#fps-display'));
    expect(elem).toBeNull();
    expect(component.fps).toBe(-1);
  });

  it('should calculate the correct fps', fakeAsync(() => {
    // Simulate animation with 10 fps
    for(let idx = 0; idx <= 11; idx ++){
      tick(100);
      component.end();
    }

    expect(component.fps).toEqual(10);
    const elem = fixture.debugElement.query(By.css('#fps-display')).nativeElement as HTMLSpanElement;
    expect(elem.textContent).toEqual('FPS: 10');
  }));

  it('should calculate the correct and min. and max fps', fakeAsync(() => {
    // Simulate animation with 10 fps
    for(let idx = 0; idx <= 11; idx ++){
      tick(100);
      component.end();
    }
    // Simulate animation with 20 fps
    for(let idx = 0; idx <= 50; idx ++){
      tick(50);
      component.end();
    }
    // Simulate animation with 5 fps
    for(let idx = 0; idx <= 11; idx ++){
      tick(200);
      component.end();
    }

    expect(component.fpsMin).toEqual(5);
    let elem = fixture.debugElement.query(By.css('#min-fps-display')).nativeElement as HTMLSpanElement;
    expect(elem.textContent).toEqual(5 + ' min');

    expect(component.fpsMax).toEqual(20);
    elem = fixture.debugElement.query(By.css('#max-fps-display')).nativeElement as HTMLSpanElement;
    expect(elem.textContent).toEqual(20 + ' max');
  }));
});
