import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ImageTransitionComponent } from '../image-transition/image-transition.component';

@Component({
  selector: 'lib-lightbox-overlay',
  templateUrl: './lightbox-overlay.component.html',
  styleUrls: ['./lightbox-overlay.component.css']
})
export class LightboxOverlayComponent implements OnInit {

  @ViewChild(ImageTransitionComponent) imageTransition!: ImageTransitionComponent;

  overlayRef?: OverlayRef;
  imageUrls = new Array<string>();
  forceFullscreen = false;
  forceShowNavButtons = false;
  imageSize = 'cover';
  autoPlay = false;
  autoPlayInterval = 5000;
  transitionDuration = 1000;
  transitionType = 'split';
  sizeX = 50.0;
  sizeY = 50.0;
  width = 0.5;
  intensity = 40.0;
  startIndex = 0;
  currentImageIndex = 1;

  swipeCoord = new Array<number>();
  swipeTime = 0;

  constructor(private changeRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.imageTransition.next();
    }
    if (event.key === 'ArrowLeft'){
      this.imageTransition.prev();
    }
    if (event.key === 'Escape'){
      this.close();
    }
  }

  /**
   * Close the lightbox
   */
  close() {
    this.overlayRef?.detach();
  }

  /**
   * method to set the index counter
   * @param index index of the image
   */
  imageIndexChange(index: number) {
    this.currentImageIndex = index + 1;
    this.changeRef.detectChanges();
  }

  /**
   * Listen to touche events for gestures (mobile)
   * @param e touch event
   * @param when indicator if 'start' or 'end'
   */
  swipe(e: TouchEvent, when: string): void {

    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        const swipe = direction[0] < 0 ? 'next' : 'previous';

        if (swipe === 'next') {
          this.imageTransition.next();
        } else if (swipe === 'previous') {
          this.imageTransition.prev();
        }
      }
    }
  }
}
