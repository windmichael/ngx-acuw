import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageTransitionComponent } from './image-transition.component';
import { PerformanceMonitorModule } from '../performance-monitor/performance-monitor.module';

@NgModule({
  declarations: [ImageTransitionComponent],
  imports: [
    CommonModule, PerformanceMonitorModule
  ],
  exports: [ImageTransitionComponent]
})
export class ImageTransitionModule { }
