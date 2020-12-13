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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
