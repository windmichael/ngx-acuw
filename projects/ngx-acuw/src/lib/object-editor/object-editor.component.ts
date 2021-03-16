import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

@Component({
  selector: 'lib-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements AfterViewInit, OnDestroy {

  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private transformControls!: TransformControls;
  private tcDraggingChange = (event: THREE.Event) => {
    this.controls.enabled = !event.value;
  }
  addObjectMenueOpen = false;

  @ViewChild('container') canvasRef!: ElementRef;

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    const canvasWidth = this.canvasRef.nativeElement.clientWidth;
    const canvasHeight = this.canvasRef.nativeElement.clientHeight;
    // Set camera
    this.camera = new THREE.PerspectiveCamera(20, canvasWidth / canvasHeight, 1, 10000);
    this.camera.position.set(100, 50, 100);
    this.scene.add(this.camera);
    this.scene.background = new THREE.Color('black');
    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 10);
    this.scene.add(gridHelper);
    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Transform controls
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.addEventListener('dragging-changed', this.tcDraggingChange);
    this.scene.add(this.transformControls);
    // Axis helper
    //const axesHelper = new THREE.AxesHelper( 5 );
    //this.scene.add( axesHelper );
    // Init renderer
    this.renderer.setSize(canvasWidth - 1, canvasHeight);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
    // Start animation
    this.animate();

    this.addBox();
  }

  ngOnDestroy(): void {
    this.transformControls.removeEventListener('dragging-changed', this.tcDraggingChange);
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
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  private addBox() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    this.transformControls.attach(mesh);

    this.scene.add(mesh);
  }

  addObject(object: string) {
    let geometry;
    let material;
    
    switch (object) {
      case 'box':
        geometry = new THREE.BoxGeometry(10, 10, 10);
        material = new THREE.MeshBasicMaterial();
        break;
      case 'circle':
        geometry = new THREE.CircleGeometry(10);
        material = new THREE.MeshBasicMaterial();
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(10, 10);
        material = new THREE.MeshBasicMaterial();
        break;
      default:
        break;
    }

    if(geometry && material){
      const mesh = new THREE.Mesh(geometry, material);
      this.transformControls.attach(mesh);
      this.scene.add(mesh);
    }
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
