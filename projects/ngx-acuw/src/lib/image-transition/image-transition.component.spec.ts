import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PerformanceMonitorComponent } from '../performance-monitor/performance-monitor.component';

import { ImageTransitionComponent } from './image-transition.component';

describe('ImageTransitionComponent', () => {
  let component: ImageTransitionComponent;
  let fixture: ComponentFixture<ImageTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageTransitionComponent, PerformanceMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageTransitionComponent);
    component = fixture.componentInstance;
    component.imageUrls = ['https://source.unsplash.com/7BLRSG-AkJs', 'https://source.unsplash.com/rcJbbK5_iIA', 'https://source.unsplash.com/yQUwIlUeU4o'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const elem = fixture.debugElement.query(By.css('.threejs-container')).query(By.css('canvas'));
    expect(elem).toBeDefined();
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
