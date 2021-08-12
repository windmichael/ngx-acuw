import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'acuw-performance-monitor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="fps-display">{{ fps | number: '1.0-0' }} FPS</div>
  `,
  styles: [
    `div {
      position: absolute;
      color: rgb(255, 255, 255);;
      background-color: rgba(0, 0, 0, 0.8);
      top: 5px;
      left: 5px;
      padding: 5px;
    }`
  ]
})
export class PerformanceMonitorComponent {

  fps = 0;
  private framesCnt = 0;
  private prevFrameTime = 0;

  constructor(private changeDetector: ChangeDetectorRef) { }

  /**
   * Method to be called at the end of a frame
   */
  end(): void {
    // Increase the frames counter
    this.framesCnt++;
    // Get the milliseconds elapsed since January 1, 1970 for the current frame 
    const currentFrameTime = Date.now();
    // Calculate the FPS only every second
    if (currentFrameTime >= this.prevFrameTime + 1000) {
      // Caclulate the frames per second
      this.fps = this.framesCnt / (currentFrameTime - this.prevFrameTime) * 1000;
      // Trigger the change detection
      this.changeDetector.detectChanges();
      // Set the elapsed time to the prevFrameTime -> for the next frame
      this.prevFrameTime = currentFrameTime;
      // Rese the frames counter
      this.framesCnt = 0;
    }
  }
}
