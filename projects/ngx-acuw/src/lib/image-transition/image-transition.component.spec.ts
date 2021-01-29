import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTransitionComponent } from './image-transition.component';

describe('ImageTransitionComponent', () => {
  let component: ImageTransitionComponent;
  let fixture: ComponentFixture<ImageTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageTransitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageTransitionComponent);
    component = fixture.componentInstance;
    component.imageUrls = ['src/image1.jpg', 'src/image2.jpg', 'src/image3.jpg'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
