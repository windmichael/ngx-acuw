import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PerformanceMonitorComponent } from '../performance-monitor/performance-monitor.component';

import { ImageAsParticlesComponent } from './image-as-particles.component';

describe('ImageAsParticlesComponent', () => {
  let component: ImageAsParticlesComponent;
  let fixture: ComponentFixture<ImageAsParticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageAsParticlesComponent, PerformanceMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAsParticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show or hide the performance monitor', () => {
    expect(component.showPerformanceMonitor).toEqual(false);
    let elem = fixture.debugElement.query(By.css('acuw-performance-monitor'));
    expect(elem).toBeNull();
    component.showPerformanceMonitor = true;
    fixture.detectChanges();
    elem = fixture.debugElement.query(By.css('acuw-performance-monitor')).nativeElement;
    expect(elem).toBeDefined();
  });
});
