import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxOverlayComponent } from './lightbox-overlay.component';

describe('LightboxOverlayComponent', () => {
  let component: LightboxOverlayComponent;
  let fixture: ComponentFixture<LightboxOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightboxOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
