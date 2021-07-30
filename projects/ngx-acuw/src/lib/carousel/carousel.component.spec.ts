import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CarouselComponent, CarouselItem } from './carousel.component';

@Component({
  selector: 'acuw-carousel-test',
  template: `<acuw-carousel>
      <acuw-carousel-item>
          <h2>Item 1</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
      </acuw-carousel-item>
      <acuw-carousel-item>
          <h2>Item 2</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
      </acuw-carousel-item>
      <acuw-carousel-item>
          <h2>Item 3</h2>
          <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>
      </acuw-carousel-item>
    </acuw-carousel>`,
})
class TestWrapperComponent {
}

describe('CarousellComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [TestWrapperComponent, CarouselComponent, CarouselItem]
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
    expect(component.carouselItemTemplates.length).toBe(3);
  });

  it('should rotate to a random element, when calling the <rotateTo(targetIndex: number)> method', fakeAsync(() => {
    const randomElem = Math.round(Math.random() * component.carouselItemTemplates.length);
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

  /*
  it('should rotate automatically when using autoPlay', fakeAsync(() => {
    component.activeCarouselElement = 0;
    component.autoPlay = true;
    tick(component.autoPlayInterval + component.rotationDuration + 1000);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.activeCarouselElement).toBe(1);
    });
  }));
  */
});
