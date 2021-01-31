import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-lightbox-overlay',
  templateUrl: './lightbox-overlay.component.html',
  styleUrls: ['./lightbox-overlay.component.css']
})
export class LightboxOverlayComponent implements OnInit {

  overlayRef?: OverlayRef;
  imageUrls = new Array<string>();
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
  
  constructor(private changeRef: ChangeDetectorRef){
  }

  ngOnInit(): void {
  }

  close(){
    this.overlayRef?.detach();
  }

  imageIndexChange(index: number){
    this.currentImageIndex = index + 1;
    this.changeRef.detectChanges();
  }
}
