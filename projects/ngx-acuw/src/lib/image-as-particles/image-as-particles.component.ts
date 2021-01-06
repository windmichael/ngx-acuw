import { Component, ViewChild, ElementRef, AfterViewInit, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { Object3D, RawShaderMaterial, Texture } from 'three';
import { TouchTexture } from './scripts/touch-texture';
import { Shaders } from './scripts/shaders';
import { RxjsTween } from '../tween/rxjs-tween';
import { interval, Observable, Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'lib-image-as-particles',
  template: `
    <div #container class="threejs-container" [style.background-color]="backgroundColor"
                      [style.justify-content]="justifyContent"
                      [style.align-items]="alignItems"></div>
    <div *ngIf="showTouchGestureInfo==true" class="touch-gesture-info" [@showHideGestureInformation]>
      <div>
        <span>Use two fingers for touch animation</span>
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px">
          <g><rect fill="none" height="24" width="24" x="0"/></g><g><g><g>
            <path d="M9,11.24V7.5C9,6.12,10.12,5,11.5,5S14,6.12,14,7.5v3.74c1.21-0.81,2-2.18,2-3.74C16,5.01,13.99,3,11.5,3S7,5.01,7,7.5 C7,9.06,7.79,10.43,9,11.24z M18.84,15.87l-4.54-2.26c-0.17-0.07-0.35-0.11-0.54-0.11H13v-6C13,6.67,12.33,6,11.5,6 S10,6.67,10,7.5v10.74c-3.6-0.76-3.54-0.75-3.67-0.75c-0.31,0-0.59,0.13-0.79,0.33l-0.79,0.8l4.94,4.94 C9.96,23.83,10.34,24,10.75,24h6.79c0.75,0,1.33-0.55,1.44-1.28l0.75-5.27c0.01-0.07,0.02-0.14,0.02-0.2 C19.75,16.63,19.37,16.09,18.84,15.87z"/></g></g></g>
          </svg>
      </div>
    </div>
  `,
  styles: [`
    .threejs-container{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #222222;
    }

    .touch-gesture-info{
      position: absolute;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      top: 20px;
      color: white;
    }

    .touch-gesture-info div{
      background-color: rgba(0,0,0,0.3);
      display: flex;
      flex-direction: row;
      padding: 6px 10px 6px 10px;
      border-radius: 5px;
    }
  `],
  animations: [
    trigger('showHideGestureInformation', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('300ms ease-in', style({ opacity: '1' }))
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('300ms ease-in', style({ opacity: '0' }))
      ])
    ])
  ]
})
export class ImageAsParticlesComponent implements AfterViewInit, OnDestroy {

  // Declare variables
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private clock: THREE.Clock = new THREE.Clock(true);
  private texture: THREE.Texture = new Texture();
  private mesh!: THREE.Mesh;
  private hitArea!: THREE.Mesh;
  private width = 0;
  private height = 0;
  private touch: TouchTexture = new TouchTexture();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private stopAnimation = false;
  private pImageUrl = '';
  private pImageChanging = false;
  private gestureInfo$: Observable<number> = interval(2000);
  private gestureInfoSubscription: Subscription = new Subscription();
  showTouchGestureInfo = false;
  justifyContent = 'center';
  alignItems = 'center';

  // Inputs
  @Input()
  set imageUrl(imageUrl: string) {
    this.pImageUrl = imageUrl;
    if (this.pImageChanging === true) { return; }
    if (this.mesh != null) {
      this.pImageChanging = true;
      this.triggerImageChange();
    }
  }
  get imageUrl(): string { return this.pImageUrl; }
  @Input() backgroundColor = '#000000';
  @Input() imageWidth = '100%';
  @Input() imageHeight = '100%';
  @Input()
  set horizontalAlignment(horizontalAlignment: string) {
    switch (horizontalAlignment) {
      case 'start':
        this.justifyContent = 'flex-start';
        break;
      case 'center':
        this.justifyContent = 'center';
        break;
      case 'end':
        this.justifyContent = 'flex-end';
        break;
      default:
        this.justifyContent = 'center';
        break;
    }
  }
  get horizontalAlignment(): string { return this.justifyContent; }
  @Input()
  set verticalAlignment(verticalAlignment: string) {
    switch (verticalAlignment) {
      case 'top':
        this.alignItems = 'flex-start';
        break;
      case 'center':
        this.alignItems = 'center';
        break;
      case 'bottom':
        this.alignItems = 'flex-end';
        break;
      default:
        this.alignItems = 'center';
        break;
    }
  }
  get verticalAlignment(): string { return this.alignItems; }

  @ViewChild('container') canvasRef!: ElementRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    if (this.pImageUrl === '') { return; }

    const canvasWidth = this.canvasRef.nativeElement.clientWidth;
    const canvasHeight = this.canvasRef.nativeElement.clientHeight;
    // Set camera
    this.camera = new THREE.PerspectiveCamera(50, canvasWidth / canvasHeight, 1, 10000);
    this.camera.position.z = 300;
    // Init particles
    this.initParticles(this.pImageUrl);
    // Init renderer
    this.renderer.setSize(canvasWidth - 1, canvasHeight);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
    // Add event listeners
    this.canvasRef.nativeElement.children[0].addEventListener('mousemove', (ev: MouseEvent) => { this.onMouseMove(ev); }, false);
    this.canvasRef.nativeElement.children[0].addEventListener('touchmove', (ev: TouchEvent) => { this.onTouchMove(ev); }, false);

    this.animate();
  }

  ngOnDestroy(): void {
    this.scene.clear();
    this.renderer.clear();
    this.texture.dispose();
    this.renderer.dispose();
    // remove event listeners
    this.canvasRef.nativeElement.removeEventListener('mousemove', (ev: MouseEvent) => { this.onMouseMove(ev); }, false);
    this.canvasRef.nativeElement.removeEventListener('touchmove', (ev: TouchEvent) => { this.onTouchMove(ev); }, false);
  }

  /**
   * Creates the particles depending on the image and initializes the touch canvas
   * @param url url of the image
   */
  private initParticles(url: string): void {
    const loader = new THREE.TextureLoader();
    loader.load(url, (texture) => {
      this.texture = texture;
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.format = THREE.RGBFormat;

      this.width = texture.image.width;
      this.height = texture.image.height;

      this.initPoints(true);
      this.initHitArea();
      this.initTouch();
      this.resize();
      this.show();
    });
  }

  /**
   * Initializes the points
   * @param discard discard pixels darker than threshold #22
   */
  private initPoints(discard: boolean): void {
    const numPoints: number = this.width * this.height;

    let numVisible = numPoints;
    let threshold = 0;
    let originalColors = new Float32Array();

    if (discard) {
      // discard pixels darker than threshold #22
      numVisible = 0;
      threshold = 34;

      const img = this.texture.image;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = this.width;
      canvas.height = this.height;
      if (ctx != null) {
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0, this.width, this.height * -1);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        originalColors = Float32Array.from(imgData.data);

        for (let i = 0; i < numPoints; i++) {
          if (originalColors[i * 4 + 0] > threshold) { numVisible++; }
        }
      }
    }

    const uniforms = {
      uTime: { value: 0 },
      uRandom: { value: 1.0 },
      uDepth: { value: 2.0 },
      uSize: { value: 0.0 },
      uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
      uTexture: { value: this.texture },
      uTouch: { value: null },
    };

    const shaders = new Shaders();
    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: shaders.particleVertex,
      fragmentShader: shaders.particleFragment,
      depthTest: false,
      transparent: true,
      // blending: THREE.AdditiveBlending
    });

    const geometry = new THREE.InstancedBufferGeometry();

    // positions
    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.setAttribute('position', positions);

    // uvs
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXY(0, 0.0, 0.0);
    uvs.setXY(1, 1.0, 0.0);
    uvs.setXY(2, 0.0, 1.0);
    uvs.setXY(3, 1.0, 1.0);
    geometry.setAttribute('uv', uvs);

    // index
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    const indices = new Uint16Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    for (let i = 0, j = 0; i < numPoints; i++) {
      if (discard && originalColors[i * 4 + 0] <= threshold) { continue; }

      offsets[j * 3 + 0] = i % this.width;
      offsets[j * 3 + 1] = Math.floor(i / this.width);

      indices[j] = i;

      angles[j] = Math.random() * Math.PI;

      j++;
    }

    geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

    this.mesh = new THREE.Mesh(geometry, material);
    const object3d = new Object3D();
    object3d.add(this.mesh);
    this.scene.add(object3d);
  }

  /**
   * Initializes the touch area
   */
  private initTouch(): void {
    (this.mesh.material as RawShaderMaterial).uniforms.uTouch.value = this.touch.texture;
  }

  /**
   * Initializes the hit area
   */
  private initHitArea(): void {
    const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
    material.visible = false;
    this.hitArea = new THREE.Mesh(geometry, material);
    this.mesh.add(this.hitArea);
  }

  /**
   * animation for showing the particles
   * @param time time of animation in ms
   */
  private show(time: number = 1000): void {
    // Tween in
    RxjsTween.createTween(RxjsTween.easeInOutQuad, [0.5, 0.0, 70.0], [1.5, 2.0, 4.0], time).subscribe(val => {
      (this.mesh.material as RawShaderMaterial).uniforms.uSize.value = val[0];
      (this.mesh.material as RawShaderMaterial).uniforms.uRandom.value = val[1];
      (this.mesh.material as RawShaderMaterial).uniforms.uDepth.value = val[2];
    }, () => { }, () => {
      this.pImageChanging = false;
    });
  }

  /**
   * animation for tween out the particles and destroy everything
   * @param time time of animation in ms
   */
  private triggerImageChange(time: number = 1000): void {
    const uSizeStart = (this.mesh.material as RawShaderMaterial).uniforms.uSize.value;
    const uRandomStart = (this.mesh.material as RawShaderMaterial).uniforms.uRandom.value;
    const uDepth = (this.mesh.material as RawShaderMaterial).uniforms.uDepth.value;
    // Tween out
    RxjsTween.createTween(RxjsTween.easeInOutQuad, [uSizeStart, uRandomStart, uDepth], [0.0, 5.0, -20.0], time).subscribe(val => {
      (this.mesh.material as RawShaderMaterial).uniforms.uSize.value = val[0];
      (this.mesh.material as RawShaderMaterial).uniforms.uRandom.value = val[1];
      (this.mesh.material as RawShaderMaterial).uniforms.uDepth.value = val[2];
    }, () => { }, () => {
      if (this.mesh != null) {
        if (this.mesh.parent != null) { this.mesh.parent.remove(this.mesh); }
        this.mesh.geometry.dispose();
        (this.mesh.material as RawShaderMaterial).dispose();
      }

      if (this.hitArea != null) {
        if (this.hitArea.parent != null) { this.hitArea.parent.remove(this.hitArea); }
        this.hitArea.geometry.dispose();
        (this.hitArea.material as RawShaderMaterial).dispose();
      }
      this.initParticles(this.pImageUrl);
      this.pImageChanging = false;
    });
  }

  /**
   * Method for triggering the animation
   */
  private animate(): void {
    window.requestAnimationFrame(() => this.animate());
    if (this.stopAnimation !== true) {
      const delta = this.clock.getDelta();
      if (this.mesh != null) {
        if (this.touch) { this.touch.update(); }
        (this.mesh.material as RawShaderMaterial).uniforms.uTime.value += delta;
      }
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Handle mouse move event
   * @param event mouse event
   */
  private onMouseMove(event: MouseEvent): void {
    // getBoundingClientRect retruns the distance in pixels of the top left corner of the element
    // to the top left corner of the viewport
    const domRect = (this.canvasRef.nativeElement as HTMLElement).getBoundingClientRect();
    // get the offset distance between the canvas, which contains the particles, to the outer container element
    const canvasEl: HTMLElement = (this.canvasRef.nativeElement.children[0] as HTMLElement);
    // Calculate the relative mouse position
    this.mouse.x = (event.clientX - domRect.left - canvasEl.offsetLeft) / canvasEl.clientWidth * 2 - 1;
    this.mouse.y = - (event.clientY - domRect.top - canvasEl.offsetTop) / canvasEl.clientHeight * 2 + 1;
    // console.info('raw: x= ' + event.clientX + ' , y= ' + event.clientY);
    // console.info('normalized: x= ' + this.mouse.x + ' , y= ' + this.mouse.y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.hitArea === undefined) { return; }
    const intersects = this.raycaster.intersectObject(this.hitArea);
    if (intersects !== undefined && intersects.length > 0 && this.touch && intersects[0].uv !== undefined) {
      this.touch.addTouch(intersects[0].uv.x, intersects[0].uv.y);
    }
  }

  /**
   * Handle touch move envent
   * @param event mouse event
   */
  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.showTouchGestureInfo = true;
      this.gestureInfoSubscription.unsubscribe();
      this.gestureInfoSubscription = this.gestureInfo$.subscribe({
        next: () => {
          this.showTouchGestureInfo = false;
          this.gestureInfoSubscription.unsubscribe();
        }
      });
      return;
    }
    event.preventDefault();
    // getBoundingClientRect retruns the distance in pixels of the top left corner of the element
    // to the top left corner of the viewport
    const domRect = (this.canvasRef.nativeElement as HTMLElement).getBoundingClientRect();
    // get the offset distance between the canvas, which contains the particles, to the outer container element
    const canvasEl: HTMLElement = (this.canvasRef.nativeElement.children[0] as HTMLElement);
    // Calculate the relative mouse position
    this.mouse.x = (event.touches[0].clientX - domRect.left - canvasEl.offsetLeft) / canvasEl.clientWidth * 2 - 1;
    this.mouse.y = - (event.touches[0].clientY - domRect.top - canvasEl.offsetTop) / canvasEl.clientHeight * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(this.hitArea);
    if (intersects !== undefined && intersects.length > 0 && this.touch && intersects[0].uv !== undefined) {
      this.touch.addTouch(intersects[0].uv.x, intersects[0].uv.y);
    }
  }

  @HostListener('window:resize') resize(): void {
    if (this.height !== undefined) {
      this.camera.aspect = this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight;
      this.camera.updateProjectionMatrix();
      const fovHeight = 2 * Math.tan(this.camera.fov * Math.PI / 180 / 2) * this.camera.position.z;
      const scale = fovHeight / this.height;
      this.mesh.scale.set(scale, scale, 1);
      // this.hitArea.scale.set(scale, scale, 1);
      if (this.renderer !== undefined) {
        const width = this.imageWidth == null ? this.canvasRef.nativeElement.clientWidth :
          this.distanceAsNumber(this.imageWidth, this.canvasRef.nativeElement.clientWidth);
        const height = this.imageHeight == null ? this.canvasRef.nativeElement.clientHeight :
          this.distanceAsNumber(this.imageHeight, this.canvasRef.nativeElement.clientHeight);
        this.renderer.setSize(width, height);
      }
    }
  }

  @HostListener('window:scroll') onScroll(): void {
    if ((window.pageYOffset + window.innerHeight) < this.canvasRef.nativeElement.offsetTop ||
      window.pageYOffset > (this.canvasRef.nativeElement.clientHeight + this.canvasRef.nativeElement.offsetTop)) {
      this.stopAnimation = true;
    } else {
      this.stopAnimation = false;
    }
  }

  private distanceAsNumber(distance: string, parentDistance: number): number {
    let returnVal = 0;
    if (distance.includes('px')) {
      returnVal = Number.parseInt(distance.replace('px', ''), 10);
    } else if (distance.includes('%')) {
      returnVal = Number.parseInt(distance.replace('%', ''), 10) / 100 * parentDistance;
    } else {
      returnVal = Number.parseInt(distance, 10);
    }
    return returnVal;
  }
}
