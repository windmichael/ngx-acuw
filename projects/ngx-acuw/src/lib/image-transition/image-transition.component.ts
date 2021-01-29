import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import * as THREE from 'three';
import { Texture, TextureLoader } from 'three';
import { RxjsTween } from '../tween/rxjs-tween';
import { ImageTransitionShaders } from './shaders/imageTransitionShaders';

@Component({
  selector: 'lib-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css']
})
export class ImageTransitionComponent implements AfterViewInit, OnDestroy {

  @Input() imageUrls: string[] = new Array<string>();

  @Input()
  get imageSize(): string { return this.pImageSize; }
  set imageSize(imageSize: string) {
    this.pImageSize = imageSize;
    if (this.mesh != null) {
      this.resize();
    }
  }

  @Input()
  get autoPlay(): boolean { return this.pAutoPlay; }
  set autoPlay(autoplay: boolean) {
    this.pAutoPlay = autoplay;
    if (this.mesh != null) {
      if (this.pAutoPlay === true) {
        this.setAutoPlayInterval();
      } else {
        this.stopAutoPlayInterval();
      }
    }
  }

  @Input()
  get autoPlayInterval(): number { return this.pAutoPlayInterval; }
  set autoPlayInterval(autoPlayInterval: number) {
    this.pAutoPlayInterval = autoPlayInterval;
    if (this.mesh != null) {
      if (this.pAutoPlay === true) {
        this.stopAutoPlayInterval();
        this.setAutoPlayInterval();
      }
    }
  }

  @Input()
  get toggleTransitionDirection(): boolean { return this.pToggleTransitionDirection; }
  set toggleTransitionDirection(toggleTransitionDirection: boolean) {
    this.pToggleTransitionDirection = toggleTransitionDirection;
    /*
    if (this.pToggleTransitionDirection === false) {
      // In case the progess is 1, change the progress to 0
      const res = this.currentImage % 2;
      if (res === 1) {
        this.textures[0] = this.textures[1];
        this.material.uniforms.texture1.value = this.textures[0];
        this.updateTextureResolution(0, 1);
        this.material.uniforms.progress.value = 0;
      }
    }
    */
  }

  @Input() transitionDuration = 1000;

  @Input()
  get transitionType(): string { return this.pTransitionType; }
  set transitionType(transitionType: string) {
    this.pTransitionType = transitionType;
    if (this.material != null) {
      this.setShaderProperties();
    }
  }

  @Input()
  get sizeX(): number { return this.pScaleX; }
  set sizeX(sizeX: number) {
    this.pScaleX = sizeX;
    if (this.material != null) {
      this.setShaderProperties();
    }
  }

  @Input()
  get sizeY(): number { return this.pScaleY; }
  set sizeY(sizeY: number) {
    this.pScaleY = sizeY;
    if (this.material != null) {
      this.setShaderProperties();
    }
  }

  @Input()
  get width(): number { return this.pWidth; }
  set width(width: number) {
    this.pWidth = width;
    if (this.material != null) {
      this.setShaderProperties();
    }
  }

  @Input()
  get intensity(): number { return this.intensity; }
  set intensity(intensity: number) {
    this.pIntensity = intensity;
    if (this.material != null) {
      this.setShaderProperties();
    }
  }

  @Input() animationEnabled = true;

  private pAutoPlay = false;
  private pAutoPlayInterval = 5000;
  private pToggleTransitionDirection = true;
  private pImageSize = 'cover';
  private pTransitionType = 'split';
  private pIntensity = 40.0;
  private pScaleX = 50.0;
  private pScaleY = 50.0;
  private pWidth = 0.5;

  private animationFrameId!: number;
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;
  private material!: THREE.ShaderMaterial;
  private textures: THREE.Texture[] = new Array<THREE.Texture>();
  private nextImageIndex = 0;
  private tranistionOngoing = false;
  private shaders: ImageTransitionShaders = new ImageTransitionShaders();
  private autoPlay$: Observable<number> = new Observable<number>();
  private autoPlaySubscription: Subscription = new Subscription();

  @ViewChild('threejsContainer') threejsContainer!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    // Init camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
    this.camera.position.set(0, 0, 2);

    // Create scene
    this.scene = new THREE.Scene();

    // Init Mesh
    if (this.imageUrls.length < 2) {
      throw new Error('At least two images are required');
    }
    this.initMesh();

    // Init renderer
    const canvasWidth = this.threejsContainer.nativeElement.clientWidth;
    const canvasHeight = this.threejsContainer.nativeElement.clientHeight;
    this.renderer.setSize(canvasWidth, canvasHeight);

    this.threejsContainer.nativeElement.appendChild(this.renderer.domElement);

    // Init autoPlay Observable
    if (this.pAutoPlay === true) {
      this.setAutoPlayInterval();
    }


    this.animate();
  }

  ngOnDestroy(): void {
    // Cancel Animation
    cancelAnimationFrame(this.animationFrameId);
    // Stop autoplay animation
    this.stopAutoPlayInterval();
    // Remove threejs container from DOM
    (this.threejsContainer.nativeElement as HTMLCanvasElement).removeChild(this.renderer.domElement);
    // Dispose textures
    this.textures.forEach(t => {
      t.dispose();
    });
    // Dispose material
    this.material.dispose();
    // Clear scene
    this.scene.clear();
    // Dispose renderer
    this.renderer.dispose();
  }

  /**
   * Initializes the mesh
   */
  private initMesh(): void {
    // Create geometry
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);

    const promises: Promise<any>[] = new Array<Promise<any>>();

    // Load 1st, 2nd and last textures
    this.textures = new Array<THREE.Texture>(this.imageUrls.length);
    for (let idx = 0; idx < this.imageUrls.length; idx++) {
      if (idx === 0 || idx === 1 || idx === (this.imageUrls.length - 1)) {
        promises.push(new Promise(resolve => {
          this.textures[idx] = (new TextureLoader()).load(this.imageUrls[idx], resolve);
        }));
      }
    }

    Promise.all(promises).then(() => {

      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          time: { value: 0 },
          progress: { value: 0 },
          border: { value: 0 },
          intensity: { value: 50.0 },
          scaleX: { value: 40.0 },
          scaleY: { value: 40.0 },
          transition: { value: 40.0 },
          swipe: { value: 0 },
          width: { value: 0.5 },
          radius: { value: 0 },
          texture1: { value: this.textures[0] },
          texture2: { value: this.textures[1] },
          resolution1: { value: new THREE.Vector4() },
          resolution2: { value: new THREE.Vector4() }
        },
        // wireframe: true,
        vertexShader: this.shaders.vertex
      });

      this.setShaderProperties();
      this.mesh = new THREE.Mesh(geometry, this.material);

      this.scene.add(this.mesh);

      this.resize();
    });
  }

  /**
   * Sets the autoPlay interval
   */
  private setAutoPlayInterval(): void {
    this.autoPlay$ = interval(this.pAutoPlayInterval);
    this.autoPlaySubscription = this.autoPlay$.subscribe({
      next: () => { this.transitionToNextTexture(); }
    });
  }

  /**
   * Resets the autoPlay interval
   */
  private resetAutoPlayInterval(): void {
    this.autoPlaySubscription.unsubscribe();
    this.autoPlaySubscription = this.autoPlay$.subscribe({
      next: () => { this.transitionToNextTexture(); }
    });
  }

  /**
   * Stops the autoPlay interval
   */
  private stopAutoPlayInterval(): void {
    this.autoPlaySubscription.unsubscribe();
  }

  /**
   * Sets the shader properties depending on the transition type
   */
  private setShaderProperties(): void {
    switch (this.transitionType) {
      case 'split':
        this.material.uniforms.intensity.value = this.pIntensity;
        this.material.fragmentShader = this.shaders.splitTransitionFrag;
        break;
      case 'fade':
        this.material.fragmentShader = this.shaders.fadeFrag;
        break;
      case 'noise':
        this.material.uniforms.scaleX.value = this.pScaleX;
        this.material.uniforms.scaleY.value = this.pScaleY;
        this.material.uniforms.width.value = this.pWidth;
        this.material.fragmentShader = this.shaders.noiseFrag;
        break;
      case 'blur':
        this.material.uniforms.intensity.value = this.pIntensity;
        this.material.fragmentShader = this.shaders.blurFrag;
        break;
      default:
        break;
    }

    this.material.needsUpdate = true;
  }

  /**
   * Animation
   */
  private animate(): void {
    if (this.animationEnabled === true) {
      this.renderer.render(this.scene, this.camera);
    }
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());
  }

  /**
   * Resizes the canvas and updates the texture resulution information of the images
   */
  @HostListener('window:resize') private resize(): void {
    const containerWidth = this.threejsContainer.nativeElement.offsetWidth;
    const containerHeight = this.threejsContainer.nativeElement.offsetHeight;
    this.renderer.setSize(containerWidth, containerHeight);
    this.camera.aspect = containerWidth / containerHeight;

    this.updateTextureResolution(this.nextImageIndex, 1);

    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    this.mesh.scale.x = this.camera.aspect;
    this.mesh.scale.y = 1;

    this.camera.updateProjectionMatrix();
  }

  /**
   * Updates the resulution of the texture for the shader depending on the image size type
   * @param textureNumber Number of the texture
   */
  private updateTextureResolution(textureNumber: number, targetGlslTexture: 1 | 2): void {
    const texture = this.textures[textureNumber];
    const containerWidth = this.threejsContainer.nativeElement.offsetWidth;
    const containerHeight = this.threejsContainer.nativeElement.offsetHeight;

    // Adapt the size of the image
    const imageAspect = texture.image.height / texture.image.width;
    const containerAspect = containerHeight / containerWidth;
    let a1; let a2;
    if (this.pImageSize === 'cover') {
      if (containerAspect > imageAspect) {
        a1 = (containerWidth / containerHeight) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (containerHeight / containerWidth) / imageAspect;
      }
    } else if (this.pImageSize === 'contain') {
      if (containerAspect < imageAspect) {
        a1 = (containerWidth / containerHeight) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (containerHeight / containerWidth) / imageAspect;
      }
    }

    if (targetGlslTexture === 1) {
      this.material.uniforms.resolution1.value.x = containerWidth;
      this.material.uniforms.resolution1.value.y = containerHeight;
      this.material.uniforms.resolution1.value.z = a1;
      this.material.uniforms.resolution1.value.w = a2;
    } else if (targetGlslTexture === 2) {
      this.material.uniforms.resolution2.value.x = containerWidth;
      this.material.uniforms.resolution2.value.y = containerHeight;
      this.material.uniforms.resolution2.value.z = a1;
      this.material.uniforms.resolution2.value.w = a2;
    }
  }

  /**
   * Starts the transition effect to the next image
   * @param posDirection indicator, if the next or previous image should be loaded
   */
  private transitionToNextTexture(backw = false): void {
    // Set the flag to indicate that the transition animation is ongoing
    this.tranistionOngoing = true;

    if (backw === true) {
      this.material.uniforms.texture2.value = this.material.uniforms.texture1.value;
      this.material.uniforms.resolution2.value.x = this.material.uniforms.resolution1.value.x;
      this.material.uniforms.resolution2.value.y = this.material.uniforms.resolution1.value.y;
      this.material.uniforms.resolution2.value.z = this.material.uniforms.resolution1.value.z;
      this.material.uniforms.resolution2.value.w = this.material.uniforms.resolution1.value.w;
      this.material.uniforms.progress.value = 1;
      // Set the next image to texture1 and update the resolution
      this.material.uniforms.texture1.value = this.textures[this.nextImageIndex];
      this.updateTextureResolution(this.nextImageIndex, 1);

      // Start the tween for doing the transition
      RxjsTween.createTween(RxjsTween.linear, 1, 0, this.transitionDuration).subscribe({
        next: val => {
          this.material.uniforms.progress.value = val;
        },
        complete: () => {
          // Set the transition flag to false to indicate that the transition animation is finished
          this.tranistionOngoing = false;
          // Reset progress to 1, thus the texture from texture 2 needs to be set to texture 1
          this.material.uniforms.texture2.value = this.textures[this.nextImageIndex];
          this.updateTextureResolution(this.nextImageIndex, 2);
          this.material.uniforms.progress.value = 0;
        }
      });
    } else {
      // Set the next image to texture2 and update the resolution
      this.material.uniforms.texture2.value = this.textures[this.nextImageIndex];
      this.updateTextureResolution(this.nextImageIndex, 2);

      // Start the tween for doing the transition
      RxjsTween.createTween(RxjsTween.linear, 0, 1, this.transitionDuration).subscribe({
        next: val => {
          this.material.uniforms.progress.value = val;
        },
        complete: () => {
          // Set the transition flag to false to indicate that the transition animation is finished
          this.tranistionOngoing = false;
          // Reset progress to 0, thus the texture from texture 2 needs to be set to texture 1
          this.material.uniforms.texture1.value = this.textures[this.nextImageIndex];
          this.updateTextureResolution(this.nextImageIndex, 1);
          this.material.uniforms.progress.value = 0;
        }
      });
    }
  }

  //#region public methods
  next(): void {
    if (this.tranistionOngoing) { return; }

    if (this.pAutoPlay === true) { this.resetAutoPlayInterval(); }

    // Set the next index
    this.nextImageIndex = (this.nextImageIndex < this.imageUrls.length - 1) ? this.nextImageIndex + 1 : 0;
    // Check if another texture needs to be loaded
    const nextButOne = this.nextImageIndex + 1 > this.imageUrls.length - 1 ? 0 : this.nextImageIndex + 1;
    if (this.textures[nextButOne] === undefined) {
      this.textures[nextButOne] = (new TextureLoader).load(this.imageUrls[nextButOne]);
    }
    this.transitionToNextTexture();
  }

  back(): void {
    if (this.tranistionOngoing) { return; }

    if (this.pAutoPlay === true) { this.resetAutoPlayInterval(); }

    // Update the number of the current shown image
    this.nextImageIndex = (this.nextImageIndex > 0) ? this.nextImageIndex - 1 : this.imageUrls.length - 1;
    // Check if another texture needs to be loaded
    const nextButOne = this.nextImageIndex - 1 < 0 ? this.imageUrls.length - 1 : this.nextImageIndex - 1;
    if (this.textures[nextButOne] === undefined) {
      this.textures[nextButOne] = (new TextureLoader).load(this.imageUrls[nextButOne]);
    }
    this.transitionToNextTexture(true);
  }
  //#endregion
}
