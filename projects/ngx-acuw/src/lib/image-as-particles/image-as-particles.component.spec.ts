import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAsParticlesComponent } from './image-as-particles.component';

describe('ImageAsParticlesComponent', () => {
  let component: ImageAsParticlesComponent;
  let fixture: ComponentFixture<ImageAsParticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageAsParticlesComponent ]
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
});
