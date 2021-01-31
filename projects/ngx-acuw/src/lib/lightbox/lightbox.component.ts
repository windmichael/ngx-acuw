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
  @Input() imageSize = 'cover';
  @Input() autoPlay = false;
  @Input() autoPlayInterval = 5000;
  @Input() transitionDuration = 1000;
  @Input() transitionType = 'split';
  @Input() sizeX = 50.0;
  @Input() sizeY = 50.0;
  @Input() width = 0.5;
  @Input() intensity = 40.0;

  private overlayRef?: OverlayRef;

  constructor(private overlay: Overlay) { }

  ngOnInit(): void {
  }

  open(index = 0){
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
    lightboxOverlayRef.instance.imageSize = this.imageSize;
    lightboxOverlayRef.instance.autoPlay = this.autoPlay;
    lightboxOverlayRef.instance.autoPlayInterval = this.autoPlayInterval;
    lightboxOverlayRef.instance.transitionDuration = this.transitionDuration;
    lightboxOverlayRef.instance.transitionType = this.transitionType;
    lightboxOverlayRef.instance.sizeX = this.sizeX;
    lightboxOverlayRef.instance.sizeY = this.sizeY;
    lightboxOverlayRef.instance.width = this.width;
    lightboxOverlayRef.instance.intensity = this.intensity;
    lightboxOverlayRef.instance.startIndex = index;
  }

  close(){
   this.overlayRef?.detach();
  }
}
