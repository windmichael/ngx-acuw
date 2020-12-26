import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { RxjsTween } from '../tween/rxjs-tween';

@Component({
  selector: 'lib-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css']
})
export class ImageTransitionComponent implements AfterViewInit {

  @Input() imageUrls: string[] = new Array<string>();
  /** supported values: 'cover', 'contain' */
  @Input() 
  get imageSize(): string { return this._imageSize; };
  set imageSize(imageSize: string){
    this._imageSize = imageSize;
    if(this.mesh != null){
      this.resize();
    } 
  }
  private _imageSize: string = 'cover';
  /** Transisiton duration in ms */
  @Input() transitionDuration: number = 1000;

  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;
  private material!: THREE.ShaderMaterial;
  private textures: THREE.Texture[] = new Array<THREE.Texture>();
  private currentImage: number = 0;
  private tranistionOngoing: boolean = false;

  @ViewChild('threejsContainer') threejsContainer!: ElementRef;

  constructor() { }

  ngAfterViewInit(){
    // Init camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
    this.camera.position.set(0, 0, 2);

    // Create scene
    this.scene = new THREE.Scene();

    // Init Mesh
    if(this.imageUrls.length < 2){
      throw new Error('At least two images are required');
    }
    this.initMesh();
    
    // Init renderer
    const canvasWidth = this.threejsContainer.nativeElement.clientWidth;
    const canvasHeight = this.threejsContainer.nativeElement.clientHeight;
    this.renderer.setSize(canvasWidth, canvasHeight);

    this.threejsContainer.nativeElement.appendChild(this.renderer.domElement);

    this.animate();
  }

  private initMesh(){
    // Create geometry
    const geometry = new THREE.PlaneBufferGeometry( 1, 1, 2, 2 );

    // Load texutre1
    var promises: Promise<any>[] = new Array<Promise<any>>();
    var promise1 = new Promise(resolve => {
      var loader = new TextureLoader();
      this.textures.push(loader.load(this.imageUrls[0], resolve));
    });
    promises.push(promise1);
    var promise2 = new Promise(resolve => {
      var loader = new TextureLoader();
      this.textures.push(loader.load(this.imageUrls[1], resolve));
    });
    promises.push(promise2);
    
    Promise.all(promises).then(() => {

      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          time: { value: 0 },
          progress: { value: 0 },
          border: { value: 0 },
          intensity: { value: 50.0 },
          scaleX: { value: 40 },
          scaleY: { value: 40 },
          transition: { value: 40 },
          swipe: { value: 0 },
          width: { value: 0 },
          radius: { value: 0 },
          texture1: { value: this.textures[0] },
          texture2: { value: this.textures[1] },
          resolution1: { value: new THREE.Vector4() },
          resolution2: { value: new THREE.Vector4() }
        },
        //wireframe: true,
        vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`,
        fragmentShader: `
        uniform float time;
        uniform float progress;
        uniform float intensity;
        uniform float width;
        uniform float scaleX;
        uniform float scaleY;
        uniform float transition;
        uniform float radius;
        uniform float swipe;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform vec4 resolution1;
        uniform vec4 resolution2;
        varying vec2 vUv;
        mat2 rotate(float a) {
          float s = sin(a);
          float c = cos(a);
          return mat2(c, -s, s, c);
        }
        const float PI = 3.1415;
        const float angle1 = PI *0.25;
        const float angle2 = -PI *0.75;
        void main()	{
          vec2 newUV1 = (vUv - vec2(0.5,0.5))*resolution1.zw + vec2(0.5,0.5);
          vec2 newUV2 = (vUv - vec2(0.5,0.5))*resolution2.zw + vec2(0.5,0.5);
          vec2 uvDivided1 = fract(newUV1*vec2(intensity,1.));
          vec2 uvDivided2 = fract(newUV2*vec2(intensity,1.));
          vec2 uvDisplaced1 = newUV1 + rotate(3.1415926/4.)*uvDivided1*progress*0.1;
          vec2 uvDisplaced2 = newUV2 + rotate(3.1415926/4.)*uvDivided2*(1. - progress)*0.1;
          vec4 t1 = texture2D(texture1,uvDisplaced1);
          vec4 t2 = texture2D(texture2,uvDisplaced2);
          // Use black background color
          // Top right
          vec2 tr1 = step(newUV1, vec2(1.0, 1.0));
          vec2 tr2 = step(newUV2, vec2(1.0, 1.0));
          float pct1 = tr1.x * tr1.y;
          float pct2 = tr2.x * tr2.y;
          // Bottom left
          vec2 bl1 = step(vec2(0.0, 0.0), newUV1);
          vec2 bl2 = step(vec2(0.0, 0.0), newUV2);
          pct1 *= bl1.x * bl1.y;
          pct2 *= bl2.x * bl2.y;
          vec4 t1wb = t1 * vec4(pct1,pct1,pct1,1.0);
          vec4 t2wb = t2 * vec4(pct2,pct2,pct2,1.0);
          gl_FragColor = mix(t1wb, t2wb, progress);
        }
      `
      });

      this.mesh = new THREE.Mesh(geometry, this.material);

      this.scene.add(this.mesh);

      this.resize();
    });
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.animate());
  }

  @HostListener('window:resize') resize(): void{
    const containerWidth = this.threejsContainer.nativeElement.offsetWidth;
    const containerHeight = this.threejsContainer.nativeElement.offsetHeight;
    this.renderer.setSize(containerWidth, containerHeight);
    this.camera.aspect = containerWidth / containerHeight;
    
    this.updateTextureResolution(0);
    this.updateTextureResolution(1);

    const dist  = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    this.mesh.scale.x = this.camera.aspect;
    this.mesh.scale.y = 1;

    this.camera.updateProjectionMatrix();
  }

  updateTextureResolution(textureNumber: number){
    const texture = textureNumber == 0 ? this.textures[0] : this.textures[1];
    const containerWidth = this.threejsContainer.nativeElement.offsetWidth;
    const containerHeight = this.threejsContainer.nativeElement.offsetHeight;

    // Adapt the size of the image
    const imageAspect = texture.image.height/texture.image.width;
    const containerAspect = containerHeight/containerWidth;
    let a1; let a2;
    if(this._imageSize === 'cover'){
      if(containerAspect>imageAspect) {
        a1 = (containerWidth/containerHeight) * imageAspect;
        a2 = 1;
      } else{
        a1 = 1;
        a2 = (containerHeight/containerWidth) / imageAspect;
      }
    } else if(this._imageSize === 'contain'){
      if(containerAspect<imageAspect) {
        a1 = (containerWidth/containerHeight) * imageAspect;
        a2 = 1;
      } else{
        a1 = 1;
        a2 = (containerHeight/containerWidth) / imageAspect;
      }
    }

    if(textureNumber == 0){
      this.material.uniforms.resolution1.value.x = containerWidth;
      this.material.uniforms.resolution1.value.y = containerHeight;
      this.material.uniforms.resolution1.value.z = a1;
      this.material.uniforms.resolution1.value.w = a2;
    }else{
      this.material.uniforms.resolution2.value.x = containerWidth;
      this.material.uniforms.resolution2.value.y = containerHeight;
      this.material.uniforms.resolution2.value.z = a1;
      this.material.uniforms.resolution2.value.w = a2;
    }
  }

  next(): void{
    if(this.tranistionOngoing){
      return;
    }

    this.tranistionOngoing = true;
    // Decide if progress should go from "0 to 1" or "1 to 0"
    const res = this.currentImage % 2;
    // Update the number of the current shown image
    if(this.currentImage < this.imageUrls.length-1){
      this.currentImage = this.currentImage + 1;
    }else{
      this.currentImage = 0;
    }
    // Define the next image
    var nextImage: number = 0;
    if(this.currentImage < this.imageUrls.length-1){
      nextImage = this.currentImage + 1;
    }
    if(res == 0){
      RxjsTween.createTween(RxjsTween.linear, 0, 1, this.transitionDuration).subscribe(val => {
        this.material.uniforms.progress.value = val;
      }, null, () => {
        this.tranistionOngoing = false;
        new Promise(resolve => {
          var loader = new TextureLoader();
          this.textures[0] = loader.load(this.imageUrls[nextImage], resolve);
        }).then(() => {
          this.material.uniforms.texture1.value = this.textures[0];
          this.updateTextureResolution(0);
        });
      });
    }else{
      RxjsTween.createTween(RxjsTween.linear, 1, 0, this.transitionDuration).subscribe(val => {
        this.material.uniforms.progress.value = val;
      }, null, () => {
        this.tranistionOngoing = false;
        new Promise(resolve => {
          var loader = new TextureLoader();
          this.textures[1] = loader.load(this.imageUrls[nextImage], resolve);
        }).then(() => {
          this.material.uniforms.texture2.value = this.textures[1];
          this.updateTextureResolution(1);
        });
      });
    }
  }
}
