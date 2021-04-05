import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxComponent } from './lightbox.component';

describe('LightboxComponent', () => {
  let component: LightboxComponent;
  let fixture: ComponentFixture<LightboxComponent>;
  let overlay: Overlay;
  let spy: any;
  let overlayRef: OverlayRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightboxComponent ],
      providers: [ Overlay ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxComponent);
    overlay = TestBed.inject(Overlay);
    component = fixture.componentInstance;
    overlayRef = overlay.create({ 
      hasBackdrop: true,
      positionStrategy: overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: overlay.scrollStrategies.block()
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lightbox overlay opened and closed successfully', () => {
    spy = spyOn(overlay, 'create').and.returnValue(overlayRef);
    component.open();
    fixture.detectChanges();
    let cdkChildElemCntOpen = document.getElementsByClassName('cdk-overlay-container').item(0)?.childElementCount;
    if(!cdkChildElemCntOpen) cdkChildElemCntOpen = 0;
    component.close();
    fixture.detectChanges();
    let cdkChildElemCntClosed = document.getElementsByClassName('cdk-overlay-container').item(0)?.childElementCount;
    if(!cdkChildElemCntClosed) cdkChildElemCntClosed = 0;
    expect(cdkChildElemCntOpen > 1 && cdkChildElemCntClosed <= 1).toBeTruthy();
  });
});
