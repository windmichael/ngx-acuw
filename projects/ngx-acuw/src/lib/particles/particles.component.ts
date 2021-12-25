import { AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BoxGeometry, BufferAttribute, BufferGeometry, CircleGeometry, Clock, Color, MathUtils, Mesh, MeshBasicMaterial, PerspectiveCamera, Points, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerformanceMonitorComponent } from '../performance-monitor/performance-monitor.component';

@Component({
  selector: 'acuw-particles',
  template: `
    <div #threejsContainer class="threejs-container"></div>
    <acuw-performance-monitor *ngIf="showPerformanceMonitor" #performanceMonitor></acuw-performance-monitor>
    `,
  styles: [`
    .threejs-container{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: inherit;
    }
  `]
})
export class ParticlesComponent implements AfterViewInit, OnDestroy {

  @ViewChild('threejsContainer') threejsContainer!: ElementRef;
  @ViewChild('performanceMonitor') performanceMonitor!: PerformanceMonitorComponent;

  // Declare variables
  private readonly RADIUS = 500;
  private readonly PARTICLES_CNT = 20;
  private readonly AMOUNTLONG = 25;
  private readonly AMOUNTLAT = 25;
  private renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, alpha: true });
  private scene: Scene = new Scene();
  private count = 0;
  private particles?: Points;
  private camera?: PerspectiveCamera;
  private orbitControl?: OrbitControls;
  private clock = new Clock(true);
  private targetPoint?: Mesh;

  @Input() showPerformanceMonitor = false;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    const canvasWidth = this.threejsContainer.nativeElement.clientWidth;
    const canvasHeight = this.threejsContainer.nativeElement.clientHeight;
    // Set camera
    this.camera = new PerspectiveCamera(75, canvasWidth / canvasHeight, 1, 10000);
    this.camera.position.z = 1000;

    //this.initParticles();
    this.initLoadingSpinner();

    this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControl.autoRotate = false;
    this.orbitControl.update();

    // Init renderer
    this.renderer.setSize(canvasWidth - 1, canvasHeight);
    this.threejsContainer.nativeElement.appendChild(this.renderer.domElement);
    // Start animation
    this.animate();
  }

  ngOnDestroy(): void {
    this.scene.clear();
    this.renderer.clear();
    this.renderer.dispose();
  }

  private initLoadingSpinner(): void {
    const indices = new Uint16Array(this.PARTICLES_CNT);
    const scales = new Float32Array(this.PARTICLES_CNT);
    const positions = new Float32Array(this.PARTICLES_CNT * 3);

    const circle = new CircleGeometry(10, 32);
    this.targetPoint = new Mesh(circle, new MeshBasicMaterial({ color: 0xffff00 }));
    
    this.scene.add(this.targetPoint);
    const x = this.targetPoint.position.x;
    const y = this.targetPoint.position.y;

    for (let idx = 0; idx < this.PARTICLES_CNT; idx++) {
      scales[idx] = 1;
      indices[idx] = idx;
    }

    for (let idx = 0; idx < this.PARTICLES_CNT*3; idx+=3) {
      positions[idx] = x + Math.random() * 50 - 25; // x
      positions[idx + 1] = y + Math.random() * 50 - 25; // y
      positions[idx + 2] = 0; // z
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('pindex', new BufferAttribute(indices, 1));
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new BufferAttribute(scales, 1));

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(0xffffff) },
        uTime: { value: 0.0 },
        uRandom: { value: 5.0 },
        uTargetX: { value: 0.0 },
        uTargetY: { value: 0.0 }
      },
      vertexShader: `
      attribute float pindex;
      attribute float scale;
      attribute vec3 coords;

      uniform float uTime;
      uniform float uRandom;
      uniform float uTargetX;
      uniform float uTargetY;

      //
      // Description : Array and textureless GLSL 2D simplex noise function.
      //      Author : Ian McEwan, Ashima Arts.
      //  Maintainer : ijm
      //     Lastmod : 20110822 (ijm)
      //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
      //               Distributed under the MIT License. See LICENSE file.
      //               https://github.com/ashima/webgl-noise
      //

      vec3 mod289_1_0(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec2 mod289_1_0(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec3 permute_1_1(vec3 x) {
        return mod289_1_0(((x*34.0)+1.0)*x);
      }

      float snoise_1_2(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                          -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        // First corner
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);

        // Other corners
        vec2 i1;
        //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
        //i1.y = 1.0 - i1.x;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        // x0 = x0 - 0.0 + 0.0 * C.xx ;
        // x1 = x0 - i1 + 1.0 * C.xx ;
        // x2 = x0 - 1.0 + 2.0 * C.xx ;
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;

        // Permutations
        i = mod289_1_0(i); // Avoid truncation effects in permutation
        vec3 p = permute_1_1( permute_1_1( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;

        // Gradients: 41 points uniformly over a line, mapped onto a diamond.
        // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        // Compute final noise value at P
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float random(float n) {
        return fract(sin(n) * 43758.5453123);
      }

      vec3 convertCoordinates(float radius, float lat, float lon) {
        float phi = (90.0 - lon) / (2.0 * 3.1415926535897);
        float theta = lat / (2.0 * 3.1415926535897);
    
        float x = radius * sin(phi) * cos(theta);
        float y = radius * cos(phi);
        float z = radius * sin(phi) * sin(theta);
    
        return vec3(x, y, z);
      }

			void main() {
        vec3 displaced = position;
        // randomise
        displaced.x += uTargetX;
        displaced.y += uTargetY;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

				gl_Position = projectionMatrix * mvPosition;
        //gl_PointSize = scale * ( 300.0 / - mvPosition.z );
        gl_PointSize = scale * ( 10.0 );
			}`,
      fragmentShader: `
      uniform vec3 color;
			void main() {
				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
				gl_FragColor = vec4( color, 1.0 );
			}`
    });

    this.particles = new Points(geometry, material);
    this.scene.add(this.particles);
  }

  private initParticles(): void {
    const numParticles = this.AMOUNTLAT * this.AMOUNTLONG;

    const indices = new Uint16Array(numParticles);
    const positions = new Float32Array(numParticles * 3);
    const coords = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;

    for (let ilong = 0; ilong < this.AMOUNTLONG; ilong++) {
      for (let ilat = 0; ilat < this.AMOUNTLAT; ilat++) {
        // Random Position at the globe
        const long = Math.random() * 180 - 90;
        const lat = Math.random() * 360;

        coords[i] = long;
        coords[i + 1] = lat;

        const cartCoords = this.convertCoordinates(this.RADIUS, lat, long);
        positions[i] = cartCoords.x; // x
        positions[i + 1] = cartCoords.y; // y
        positions[i + 2] = cartCoords.z; // z

        scales[j] = 1;

        indices[j] = j;

        i += 3;
        j++;
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('pindex', new BufferAttribute(indices, 1));
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('coords', new BufferAttribute(coords, 3));
    geometry.setAttribute('scale', new BufferAttribute(scales, 1));

    const material = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(0xffffff) },
        uTime: { value: 0.0 },
        uRandom: { value: 5.0 }
      },
      vertexShader: `
      attribute float pindex;
      attribute float scale;
      attribute vec3 coords;

      uniform float uTime;
      uniform float uRandom;

      //
      // Description : Array and textureless GLSL 2D simplex noise function.
      //      Author : Ian McEwan, Ashima Arts.
      //  Maintainer : ijm
      //     Lastmod : 20110822 (ijm)
      //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
      //               Distributed under the MIT License. See LICENSE file.
      //               https://github.com/ashima/webgl-noise
      //

      vec3 mod289_1_0(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec2 mod289_1_0(vec2 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec3 permute_1_1(vec3 x) {
        return mod289_1_0(((x*34.0)+1.0)*x);
      }

      float snoise_1_2(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                          -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        // First corner
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);

        // Other corners
        vec2 i1;
        //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
        //i1.y = 1.0 - i1.x;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        // x0 = x0 - 0.0 + 0.0 * C.xx ;
        // x1 = x0 - i1 + 1.0 * C.xx ;
        // x2 = x0 - 1.0 + 2.0 * C.xx ;
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;

        // Permutations
        i = mod289_1_0(i); // Avoid truncation effects in permutation
        vec3 p = permute_1_1( permute_1_1( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;

        // Gradients: 41 points uniformly over a line, mapped onto a diamond.
        // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt( a0*a0 + h*h );
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

        // Compute final noise value at P
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float random(float n) {
        return fract(sin(n) * 43758.5453123);
      }

      vec3 convertCoordinates(float radius, float lat, float lon) {
        float phi = (90.0 - lon) / (2.0 * 3.1415926535897);
        float theta = lat / (2.0 * 3.1415926535897);
    
        float x = radius * sin(phi) * cos(theta);
        float y = radius * cos(phi);
        float z = radius * sin(phi) * sin(theta);
    
        return vec3(x, y, z);
      }

			void main() {
        vec3 displaced = coords;
        // randomise
        displaced.x += uRandom * snoise_1_2(vec2(random(pindex) * random(0.1), uTime * 0.02));
        displaced.y += uRandom * snoise_1_2(vec2(random(pindex) * random(0.5), uTime * 0.02));
        vec4 mvPosition = modelViewMatrix * vec4( convertCoordinates(500.0, displaced.y, displaced.x), 1.0 );

				gl_Position = projectionMatrix * mvPosition;
        //gl_PointSize = scale * ( 300.0 / - mvPosition.z );
        gl_PointSize = scale * ( 10.0 );
			}`,
      fragmentShader: `
      uniform vec3 color;
			void main() {
				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
				gl_FragColor = vec4( color, 1.0 );
			}`
    });

    this.particles = new Points(geometry, material);
    this.scene.add(this.particles);
  }

  /**
   * Method for triggering the animation
   */
  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame(() => this.animate());

      /* if (this.particles) {
        const delta = this.clock.getDelta();
        (this.particles.material as ShaderMaterial).uniforms.uTime.value += delta;

        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.scale.needsUpdate = true;
      } */

      if (this.targetPoint && this.particles) {
        const time = this.clock.getElapsedTime();
        const prevX = this.targetPoint.position.x;
        const prevY = this.targetPoint.position.y;
        this.targetPoint.position.x = 500 * Math.cos(time);
        this.targetPoint.position.y = 500 * Math.sin(time);

        const delta = this.clock.getDelta();
        (this.particles.material as ShaderMaterial).uniforms.uTime.value += delta;
        (this.particles.material as ShaderMaterial).uniforms.uTargetX.value = this.targetPoint.position.x;
        (this.particles.material as ShaderMaterial).uniforms.uTargetY.value = this.targetPoint.position.y;

        const positions = this.particles.geometry.attributes.position.array as Float32Array;
        for (let idx = 0; idx < this.PARTICLES_CNT*3; idx+=3) {
          positions[idx] = 
        }
      }

      if (this.camera) {
        this.renderer.render(this.scene, this.camera);
      }

      if (this.orbitControl) {
        this.orbitControl.update();
      }

      this.count += 0.1;

      if (this.performanceMonitor && this.showPerformanceMonitor) {
        this.performanceMonitor.end();
      }
    });
  }

  /**
   * Resizes the canvas and updates the texture resulution information of the images
   */
  @HostListener('window:resize') resize(): void {
    // Get width and heigh of the threejs dom element after window resize
    const divWidth = this.threejsContainer.nativeElement.clientWidth;
    const divHeight = this.threejsContainer.nativeElement.clientHeight;
    // Define aspect ratio
    if (this.camera) {
      this.camera.aspect = divWidth / divHeight;
      this.camera.updateProjectionMatrix();
    }
  }

  private convertCoordinates(radius: number, lat: number, lon: number): Vector3 {
    const phi = MathUtils.degToRad(90 - lon);
    const theta = MathUtils.degToRad(lat);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new Vector3(x, y, z);
  }
}
