import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'acuw-performance-monitor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './performance-monitor.component.html',
  styleUrls: ['./performance-monitor.component.css']
})
export class PerformanceMonitorComponent {

  fps = -1;
  fpsMin = -1;
  fpsMax = -1;
  private framesCnt = 0;
  private timeLastFpsCalc = 0;

  constructor(private changeDetector: ChangeDetectorRef) { }

  /**
   * Method to be called at the end of a frame
   */
  end(): void {
    // When called the first time, set the current time and return
    if (this.timeLastFpsCalc === 0) {
      this.timeLastFpsCalc = Date.now();
      return;
    }
    // Increase the frames counter
    this.framesCnt++;
    // Get the milliseconds elapsed since January 1, 1970 for the current frame 
    const currentFrameTime = Date.now();
    // Calculate the FPS only every second
    if (currentFrameTime >= this.timeLastFpsCalc + 1000) {
      // Calculate the frames per second
      this.fps = Math.round(this.framesCnt / (currentFrameTime - this.timeLastFpsCalc) * 1000);
      // Calculate the min. frames per second
      if(this.fpsMin === -1 || this.fps < this.fpsMin){
        this.fpsMin = this.fps;
      }
      // Calculate the max. frames per second
      if(this.fpsMax === -1 || this.fps > this.fpsMax){
        this.fpsMax = this.fps;
      }
      // Trigger the change detection
      this.changeDetector.detectChanges();
      // Set the elapsed time to the timeLastFpsCalc
      this.timeLastFpsCalc = currentFrameTime;
      // Rese the frames counter
      this.framesCnt = 0;
    }
  }
}
