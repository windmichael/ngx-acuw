import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxComponent } from './lightbox.component';
import { ImageTransitionModule } from '../image-transition/image-transition.module';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PerformanceMonitorModule } from '../performance-monitor/performance-monitor.module';

@NgModule({
    declarations: [LightboxComponent, LightboxOverlayComponent],
    imports: [
        CommonModule,
        ImageTransitionModule,
        OverlayModule,
        PerformanceMonitorModule
    ],
    exports: [LightboxComponent]
})
export class LightboxModule { }
