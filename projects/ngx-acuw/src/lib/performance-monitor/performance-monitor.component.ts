import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'acuw-performance-monitor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './performance-monitor.component.html',
  styleUrls: ['./performance-monitor.component.css']
})
export class PerformanceMonitorComponent {

  @ViewChild('chart') chart!: ElementRef;

  fps = -1;
  fpsMin = -1;
  fpsMax = -1;
  private framesCnt = 0;
  private timeLastFpsCalc = 0;
  private fpsHistory = new Array<number>()
  private readonly maxHistoryLength = 60;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

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
      this.fps = this.framesCnt / (currentFrameTime - this.timeLastFpsCalc) * 1000;
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
      // Reset the frames counter
      this.framesCnt = 0;
      // Add fps to the history array
      this.fpsHistory.push(this.fps);
      if(this.fpsHistory.length >= this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      // Create / Update chart
      const canvasEl = this.chart.nativeElement as HTMLCanvasElement;
      const ctx = canvasEl.getContext('2d');
      if(ctx) {
        ctx.fillStyle = 'rgb(30, 30, 30)';
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.moveTo(0, canvasEl.height);
        for(let idx = 0; idx <= this.fpsHistory.length; idx++){
          ctx.lineTo(canvasEl.width / this.maxHistoryLength * idx, 
            canvasEl.height - (this.fpsHistory[idx] / this.fpsMax * canvasEl.height));
          if(idx === this.fpsHistory.length - 1){
            ctx.lineTo(canvasEl.width / this.maxHistoryLength * idx, canvasEl.height);
          }
        }
        ctx.fill();
      }
    }
  }
}
