import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';



@NgModule({
  declarations: [LightboxComponent],
  imports: [
    CommonModule
  ],
  exports: [LightboxComponent]
})
export class LightboxModule { }
