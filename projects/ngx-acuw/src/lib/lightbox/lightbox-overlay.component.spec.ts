import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImageTransitionComponent } from '../image-transition/image-transition.component';
import { ImageTransitionModule } from '../image-transition/image-transition.module';
import { PerformanceMonitorComponent } from '../performance-monitor/performance-monitor.component';
import { LightboxOverlayComponent } from './lightbox-overlay.component';

describe('LightboxOverlayComponent', () => {
  let component: LightboxOverlayComponent;
  let fixture: ComponentFixture<LightboxOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightboxOverlayComponent, ImageTransitionComponent, PerformanceMonitorComponent ],
      imports: [ ImageTransitionModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxOverlayComponent);
    component = fixture.componentInstance;
    component.imageUrls = ['https://source.unsplash.com/7BLRSG-AkJs', 'https://source.unsplash.com/rcJbbK5_iIA', 'https://source.unsplash.com/yQUwIlUeU4o'];
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

  it('should go to next or prev image on key strokes', () => {
    let spy = spyOn(component.imageTransition, 'next');
    component.keyEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    expect(spy).toHaveBeenCalled();

    spy = spyOn(component.imageTransition, 'prev');
    component.keyEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    expect(spy).toHaveBeenCalled();

    spy = spyOn(component, 'close');
    component.keyEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    expect(spy).toHaveBeenCalled();
  });
});
