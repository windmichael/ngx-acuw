import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxComponent } from './lightbox.component';

describe('LightboxComponent', () => {
  let component: LightboxComponent;
  let fixture: ComponentFixture<LightboxComponent>;
  let overlay: Overlay; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightboxComponent ],
      providers: [ Overlay ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
