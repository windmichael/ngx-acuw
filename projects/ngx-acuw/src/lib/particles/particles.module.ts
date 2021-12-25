import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticlesComponent } from './particles.component';
import { PerformanceMonitorModule } from '../performance-monitor/performance-monitor.module';



@NgModule({
  declarations: [
    ParticlesComponent
  ],
  imports: [
    CommonModule,
    PerformanceMonitorModule
  ],
  exports: [
    ParticlesComponent
  ]
})
export class ParticlesModule { }
