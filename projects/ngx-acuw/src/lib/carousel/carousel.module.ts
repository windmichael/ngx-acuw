import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent, CarouselItem } from './carousel.component';
import { PerformanceMonitorModule } from '../performance-monitor/performance-monitor.module';



@NgModule({
  declarations: [CarouselComponent, CarouselItem],
  imports: [
    CommonModule,
    PerformanceMonitorModule
  ],
  exports: [CarouselComponent, CarouselItem]
})
export class CarouselModule { }
