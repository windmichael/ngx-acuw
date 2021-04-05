import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageTransitionComponent } from '../image-transition/image-transition.component';
import { ImageTransitionModule } from '../image-transition/image-transition.module';

import { LightboxOverlayComponent } from './lightbox-overlay.component';

describe('LightboxOverlayComponent', () => {
  let component: LightboxOverlayComponent;
  let fixture: ComponentFixture<LightboxOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightboxOverlayComponent, ImageTransitionComponent ],
      imports: [ ImageTransitionModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxOverlayComponent);
    component = fixture.componentInstance;
    component.imageUrls = ['src/image1.jpg', 'src/image2.jpg', 'src/image3.jpg'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
