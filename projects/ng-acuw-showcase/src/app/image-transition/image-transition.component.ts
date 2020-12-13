import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RxjsTween } from 'projects/ngx-acuw/src/lib/tween/rxjs-tween';
import * as THREE from 'three';
import { TextureLoader } from 'three';

@Component({
  selector: 'app-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css']
})
export class ImageTransitionComponent implements AfterViewInit {

  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;
  private material!: THREE.ShaderMaterial;
  private textures: THREE.Texture[] = new Array<THREE.Texture>();

  @ViewChild('threejsContainer') threejsContainer!: ElementRef;

  constructor() { }

  ngAfterViewInit(){
    // Init camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
    this.camera.position.set(0, 0, 2);

    // Create scene
    this.scene = new THREE.Scene();

    // Create geometry
    const geometry = new THREE.PlaneBufferGeometry( 1, 1, 2, 2 );

    var promises: Promise<any>[] = new Array<Promise<any>>();
    var promise1 = new Promise(resolve => {
      var loader = new TextureLoader();
      this.textures.push(loader.load('assets/image-transition/img71.jpg', resolve));
    });
    promises.push(promise1);
    var promise2 = new Promise(resolve => {
      var loader = new TextureLoader();
      this.textures.push(loader.load('assets/image-transition/img72.jpg', resolve));
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
          displacement: { value: new THREE.TextureLoader().load('assets/image-transition/img72.jpg') },
          resolution: { value: new THREE.Vector4() },
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
        uniform sampler2D displacement;
        uniform vec4 resolution;
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
          vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
          vec2 uvDivided = fract(newUV*vec2(intensity,1.));
          vec2 uvDisplaced1 = newUV + rotate(3.1415926/4.)*uvDivided*progress*0.1;
          vec2 uvDisplaced2 = newUV + rotate(3.1415926/4.)*uvDivided*(1. - progress)*0.1;
          vec4 t1 = texture2D(texture1,uvDisplaced1);
          vec4 t2 = texture2D(texture2,uvDisplaced2);
          gl_FragColor = mix(t1, t2, progress);
        }
      `
      });


      this.mesh = new THREE.Mesh(geometry, this.material);

      this.scene.add(this.mesh);

      this.resize();
    });

    //var planeGem = new THREE.PlaneGeometry(1, 1, 2, 2);
    //var baisMat = new THREE.MeshBasicMaterial();
    //baisMat.color = new THREE.Color('skyblue');
    //this.mesh = new THREE.Mesh(planeGem, baisMat);
    //this.scene.add(this.mesh);
    
    // Init renderer
    const canvasWidth = this.threejsContainer.nativeElement.clientWidth;
    const canvasHeight = this.threejsContainer.nativeElement.clientHeight;
    this.renderer.setSize(canvasWidth, canvasHeight);

    this.threejsContainer.nativeElement.appendChild(this.renderer.domElement);

    this.animate();
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.animate());
  }

  resize(): void{
    const containerWidth = this.threejsContainer.nativeElement.offsetWidth;
    const containerHeight = this.threejsContainer.nativeElement.offsetHeight;
    this.renderer.setSize(containerWidth, containerHeight);
    this.camera.aspect = containerWidth / containerHeight;
    

    // image cover
    const imageAspect = this.textures[0].image.height/this.textures[0].image.width;
    let a1; let a2;
    if(containerHeight/containerWidth>imageAspect) {
      a1 = (containerWidth/containerHeight) * imageAspect;
      a2 = 1;
    } else{
      a1 = 1;
      a2 = (containerHeight/containerWidth) / imageAspect;
    }

    this.material.uniforms.resolution.value.x = containerWidth;
    this.material.uniforms.resolution.value.y = containerHeight;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist  = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    this.mesh.scale.x = this.camera.aspect;
    this.mesh.scale.y = 1;

    this.camera.updateProjectionMatrix();
  }

  toggle(): void{
    RxjsTween.createTween(RxjsTween.linear, 0, 1, 1000).subscribe(val => {
      this.material.uniforms.progress.value = val;
    });
  }
}
