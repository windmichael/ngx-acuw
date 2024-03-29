import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PerformanceMonitorComponent } from '../performance-monitor/performance-monitor.component';

import { CarouselComponent, CarouselItem } from './carousel.component';

@Component({
  selector: 'acuw-carousel-test',
  template: `<acuw-carousel>
      <acuw-carousel-item *ngFor="let item of carouselItems;index as i" >
          <h2>Item {{ item }}</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
      </acuw-carousel-item>
    </acuw-carousel>`,
})
class TestWrapperComponent {
  carouselItems = ['1', '2', '3'];
}

describe('CarousellComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [TestWrapperComponent, CarouselComponent, CarouselItem, PerformanceMonitorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct number of children', () => {
    fixture.detectChanges();
    expect(component.carouselItemTemplates.length).toBe(fixture.componentInstance.carouselItems.length);
  });

  it('should rotate to a random element, when calling the <rotateTo(targetIndex: number)> method', fakeAsync(() => {
    const randomElem = Math.round(Math.random() * (component.carouselItemTemplates.length - 1));
    component.rotateTo(randomElem).then(response => {
      expect(response).toEqual(randomElem);
      expect(component.activeCarouselElement).toEqual(randomElem);
    });
  }));

  it('should rotate to second element when fist element is active and the <next()> method is invoked', fakeAsync(() => {
    component.activeCarouselElement = 0;
    component.next().then(response => {
      expect(response).toEqual(1);
      expect(component.activeCarouselElement).toEqual(1);
    });
  }));

  it('should rotate to fist element when last element is active and the <next()> method is invoked', fakeAsync(() => {
    component.activeCarouselElement = 2;
    component.next().then(response => {
      expect(response).toEqual(0);
      expect(component.activeCarouselElement).toEqual(0);
    });
  }));

  it('should rotate to first element when second element is active and the <previous()> method is invoked', fakeAsync(() => {
    component.activeCarouselElement = 1;
    component.previous().then(response => {
      expect(response).toEqual(0);
      expect(component.activeCarouselElement).toEqual(0);
    });
  }));

  it('should rotate to third element when fist element is active and the <previous()> method is invoked', fakeAsync(() => {
    component.activeCarouselElement = 0;
    component.previous().then(response => {
      expect(response).toEqual(2);
      expect(component.activeCarouselElement).toEqual(2);
    });
  }));

  it('should show or hide the indication dots', () => {
    const select = fixture.nativeElement.querySelector('.dots') as HTMLElement;

    component.showDots = true;
    fixture.detectChanges();
    expect(select.style.visibility).toBe('visible');

    component.showDots = false;
    fixture.detectChanges();
    expect(select.style.visibility).toBe('hidden');
  });

  it('should show the correct number of indication dots', () => {
    const select = fixture.nativeElement.querySelector('.dots') as HTMLElement;
    expect(select.getElementsByTagName('svg').length).toBe(3);
  });

  it('should change the number of carousel components', () => {
    fixture.componentInstance.carouselItems.push('4');
    fixture.detectChanges();
    component.updateCarouselItems();
    expect(component.carouselItemTemplates.length).toBe(fixture.componentInstance.carouselItems.length);

    fixture.componentInstance.carouselItems.pop();
    fixture.detectChanges();
    component.updateCarouselItems();
    expect(component.carouselItemTemplates.length).toBe(fixture.componentInstance.carouselItems.length);
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
