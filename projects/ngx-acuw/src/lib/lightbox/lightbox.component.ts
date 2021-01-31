import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, OnInit } from '@angular/core';
import { LightboxOverlayComponent } from './lightbox-overlay.component';

@Component({
  selector: 'lib-lightbox',
  template: ''
})
export class LightboxComponent implements OnInit {

  @Input() imageUrls = new Array<string>();

  private overlayRef?: OverlayRef;

  constructor(private overlay: Overlay) { }

  ngOnInit(): void {
  }

  open(){
    // Define settings of the overlay
    this.overlayRef = this.overlay.create({ 
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    // Listen to backdrop event for detaching the overlay
    this.overlayRef.backdropClick().subscribe({
      next: () => { this.overlayRef?.detach(); }
    });

    // Attach the LightboxOverlayComponent to the overlayRef instance
    const lightboxOverlayRef = this.overlayRef.attach(new ComponentPortal(LightboxOverlayComponent));

    // Pass data to the LightboxOverlayComponent
    lightboxOverlayRef.instance.overlayRef = this.overlayRef;
    lightboxOverlayRef.instance.imageUrls = this.imageUrls;
  } 

  close(){
   this.overlayRef?.detach();
  }
}
