import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageAsParticlesComponent } from './image-as-particles.component';
import { PerformanceMonitorModule } from '../performance-monitor/performance-monitor.module';



@NgModule({
  declarations: [ImageAsParticlesComponent],
  imports: [
    CommonModule, PerformanceMonitorModule
  ],
  exports: [ImageAsParticlesComponent]
})
export class ImageAsParticlesModule { }
