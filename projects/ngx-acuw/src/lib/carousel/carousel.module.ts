import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent, CarouselItem } from './carousel.component';



@NgModule({
  declarations: [CarouselComponent, CarouselItem],
  imports: [
    CommonModule
  ],
  exports: [CarouselComponent, CarouselItem]
})
export class CarouselModule { }
