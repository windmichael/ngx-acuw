import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTransitionDialogComponent } from './image-transition-dialog.component';

describe('ImageTransitionDialogComponent', () => {
  let component: ImageTransitionDialogComponent;
  let fixture: ComponentFixture<ImageTransitionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageTransitionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageTransitionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
