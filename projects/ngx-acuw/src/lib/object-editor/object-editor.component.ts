import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'lib-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements AfterViewInit, OnDestroy {

  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;

  @ViewChild('container') canvasRef!: ElementRef;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    const canvasWidth = this.canvasRef.nativeElement.clientWidth;
    const canvasHeight = this.canvasRef.nativeElement.clientHeight;
    // Set camera
    this.camera = new THREE.PerspectiveCamera(20, canvasWidth / canvasHeight, 1, 10000);
    this.scene.add(this.camera);
    this.scene.background = new THREE.Color('black');
    // Grid helper
    const gridHelper = new THREE.GridHelper( 100, 10 );
    this.scene.add( gridHelper );
    // Orbit controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Init renderer
    this.renderer.setSize(canvasWidth - 1, canvasHeight);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
    // Start animation
    this.animate();
  }

  ngOnDestroy(): void {
    this.scene.clear();
    this.renderer.clear();
    this.renderer.dispose();
  }

  /**
   * Method for triggering the animation
   */
  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame(() => this.animate());
      this.renderer.render(this.scene, this.camera);
    });
  }

  @HostListener('window:resize') resize(): void {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = this.canvasRef.nativeElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
  }
}
