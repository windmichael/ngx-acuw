import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { ImageTransitionModule } from '../image-transition/image-transition.module';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [LightboxComponent, LightboxOverlayComponent],
  imports: [
    CommonModule,
    ImageTransitionModule,
    OverlayModule
  ],
  exports: [ LightboxComponent ],
  entryComponents: [ LightboxOverlayComponent ]
})
export class LightboxModule { }
