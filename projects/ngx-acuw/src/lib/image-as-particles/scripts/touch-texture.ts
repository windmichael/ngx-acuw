import { Texture } from 'three';
import { Trail } from './trail';

export class TouchTexture {
  // Variables
  private size: number;
  private maxAge: number;
  private radius: number;
  private trail: Trail[];
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  public texture!: Texture;

  constructor() {
    this.size = 64;
    this.maxAge = 120;
    this.radius = 0.15;
    this.trail = new Array<Trail>();

    this.initTexture();
  }

  /**
   * Initializes the texture for the touch area
   */
  initTexture(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.texture = new Texture(this.canvas);

    this.canvas.id = 'touchTexture';
    this.canvas.style.width = this.canvas.style.height = `${this.canvas.width}px`;
  }

  /**
   * Updates the trail
   */
  update(): void {
    this.clear();

    // age points
    this.trail.forEach((point, i) => {
      point.age++;
      // remove old
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      }
    });

    this.trail.forEach((point, i) => {
      this.drawTouch(point);
    });

    this.texture.needsUpdate = true;
  }

  clear(): void {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(px: number, py: number): void {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - px;
      const dy = last.y - py;
      const dd = dx * dx + dy * dy;
      force = Math.min(dd * 10000, 1);
    }
    this.trail.push({ x: px, y: py, age: 0, force });
  }

  drawTouch(point: Trail): void {
    const pos = {
      x: point.x * this.size,
      y: (1 - point.y) * this.size
    };

    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = this.easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
    } else {
      intensity = this.easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
    }

    intensity *= point.force;

    const radius = this.size * this.radius * intensity;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
    grd.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private easeOutSine(t: number, b: number, c: number, d: number): number {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }
}
