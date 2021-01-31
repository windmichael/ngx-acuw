import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { ImageTransitionModule } from '../image-transition/image-transition.module';
import { LightboxOverlayComponent } from './lightbox-overlay.component';

@NgModule({
  declarations: [LightboxComponent, LightboxOverlayComponent],
  imports: [
    CommonModule,
    ImageTransitionModule
  ],
  exports: [ LightboxComponent ]
})
export class LightboxModule { }
