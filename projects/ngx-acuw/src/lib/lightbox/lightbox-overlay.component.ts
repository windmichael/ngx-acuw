import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-lightbox-overlay',
  templateUrl: './lightbox-overlay.component.html',
  styleUrls: ['./lightbox-overlay.component.css']
})
export class LightboxOverlayComponent implements OnInit {

  overlayRef?: OverlayRef;
  imageUrls = new Array<string>();
  
  constructor(){
  }

  ngOnInit(): void {
  }

  close(){
    this.overlayRef?.detach();
  }
}
