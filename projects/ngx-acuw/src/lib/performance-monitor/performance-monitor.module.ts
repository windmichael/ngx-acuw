import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceMonitorComponent } from './performance-monitor.component';



@NgModule({
  declarations: [
    PerformanceMonitorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PerformanceMonitorComponent
  ]
})
export class PerformanceMonitorModule { }
