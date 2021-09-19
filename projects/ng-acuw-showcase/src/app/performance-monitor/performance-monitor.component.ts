import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdditiveBlending, Color, DoubleSide, Fog, Mesh, MeshStandardMaterial, OctahedronBufferGeometry, PerspectiveCamera, PointLight, Scene, TextureLoader, WebGLRenderer } from 'three';
import { UtilityService } from '../services/utility.service';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerformanceMonitorComponent } from 'projects/ngx-acuw/src/public-api';

@Component({
  selector: 'app-performance-monitor',
  templateUrl: './performance-monitor.component.html',
  styleUrls: ['./performance-monitor.component.css']
})
export class PerformanceMonitorDemoComponent implements OnInit, AfterViewInit {

  /**
   * Properties
   */
   selectedTabIndex = 0;
   code: any;
   private renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, alpha: true });
   private scene: Scene = new Scene();
   private camera!: PerspectiveCamera;
   private geometry!: OctahedronBufferGeometry;
   private animationFrameId!: number;

   @ViewChild('threejsContainer') threejsContainer!: ElementRef;
   @ViewChild('performanceMonitor') performanceMonitor!: PerformanceMonitorComponent;
   
  /**
   * Constructor
   */
   constructor(private route: ActivatedRoute,
    private router: Router, private utility: UtilityService, private ngZone: NgZone) {
      this.code = code
  }

  ngOnInit(): void {
    const activeTab = this.route.snapshot.paramMap.get('tab');
    this.selectedTabIndex = this.utility.getTabIndexFromParam(activeTab);
  }

  ngAfterViewInit(): void {
    if(this.selectedTabIndex == 0){
      this.initScene();
    }
  }

  ngOnDestroy(): void {
    // Clear scene
    this.scene.clear();
    cancelAnimationFrame(this.animationFrameId);
  }

  initScene(): void {
    const canvasWidth = this.threejsContainer.nativeElement.clientWidth;
    const canvasHeight = this.threejsContainer.nativeElement.clientHeight;
    // Set camera
    this.camera = new PerspectiveCamera(50, canvasWidth / canvasHeight, 1, 10000);
    this.camera.position.z = 20;

    // Add light
    const light = new PointLight( 0xffffff, 0.5 );
    light.position.set( 0, 20, 30 );
    this.scene.add( light );
    
    // Create geometry
    this.geometry = new OctahedronBufferGeometry( 5, 1 );

    this.geometry.clearGroups(); // just in case
    this.geometry.addGroup(0, 3, 0);
    this.geometry.addGroup(3, 3, 1);
    this.geometry.addGroup(6, 3, 0);
    this.geometry.addGroup(9, 3, 0);
    this.geometry.addGroup(12, 3, 1);
    this.geometry.addGroup(15, 3, 0);
    this.geometry.addGroup(18, 3, 1);
    this.geometry.addGroup(21, 3, 1);
    this.geometry.addGroup(24, 3, 0);
    this.geometry.addGroup(27, 3, 1);
    this.geometry.addGroup(30, 3, 0);
    this.geometry.addGroup(33, 3, 0);
    this.geometry.addGroup(36, 3, 1);
    this.geometry.addGroup(39, 3, 0);
    this.geometry.addGroup(42, 3, 1);
    this.geometry.addGroup(45, 3, 1);
    this.geometry.addGroup(48, 3, 0);
    this.geometry.addGroup(51, 3, 1);
    this.geometry.addGroup(54, 3, 0);
    this.geometry.addGroup(57, 3, 0);
    this.geometry.addGroup(60, 3, 1);
    this.geometry.addGroup(63, 3, 0);
    this.geometry.addGroup(66, 3, 1);
    this.geometry.addGroup(69, 3, 1);
    this.geometry.addGroup(72, 3, 0);
    this.geometry.addGroup(75, 3, 1);
    this.geometry.addGroup(78, 3, 0);
    this.geometry.addGroup(81, 3, 0);
    this.geometry.addGroup(84, 3, 1);
    this.geometry.addGroup(87, 3, 0);
    this.geometry.addGroup(90, 3, 1);
    this.geometry.addGroup(93, 3, 1);

    const texture = new TextureLoader().load('assets/performance-monitor/metalroughness.png');

    const materials = [
        new MeshStandardMaterial ( { color: 0xffffff, emissive: 0x02f70a, emissiveIntensity: 1.0, roughness: 0.25, metalness: 1.0,
        roughnessMap: texture, transparent: true, blending: AdditiveBlending, opacity: 0.6, side: DoubleSide } ),
        new MeshStandardMaterial ( { color: 0xa5a5a5, emissive: 0x474747, emissiveIntensity: 1.0, roughness: 0.8, metalness: 1.0,
          roughnessMap: texture, side: DoubleSide } )
    ];

    var mesh = new Mesh( this.geometry, materials );
    this.scene.add( mesh );
    
    // Init renderer
    this.renderer.setSize(canvasWidth - 1, canvasHeight);
    this.threejsContainer.nativeElement.appendChild(this.renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.update();

    // Start animation
    this.animate();
  }

  /**
   * Method for triggering the animation
   */
   private animate(): void {
     if(this.renderer) {
      this.ngZone.runOutsideAngular(() => {
        this.animationFrameId = window.requestAnimationFrame(() => this.animate());
        this.geometry.rotateY(0.005);
        this.geometry.rotateZ(0.001);
        this.renderer.render(this.scene, this.camera);
        this.performanceMonitor.end();
      });
     }
  }

  @HostListener('window:resize') resize(): void {
    if (this.renderer && this.threejsContainer) {
      const canvasWidth = this.threejsContainer.nativeElement.clientWidth;
      const canvasHeight = this.threejsContainer.nativeElement.clientHeight;
      // Define aspect ratio
      this.camera.aspect = canvasWidth / canvasHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvasWidth, canvasHeight);
    }
  }

  /**
   * Change the route, when the tab is changed
   * @param index index of the tab
   */
   selctedTabChanged(index: number) {
    const param = this.utility.getParamFromTabIndex(index);
    const activeTab = this.route.snapshot.paramMap.get('tab');
    if (activeTab === null) {
      this.router.navigate([param], { relativeTo: this.route });
    } else {
      this.router.navigate(['../' + param], { relativeTo: this.route });
    }
    if (index === 0){
      setTimeout(() => {
        this.initScene();
      }, 0);
    } else {
      this.ngOnDestroy();
    }
  }
}

  /**
 * constant, which contains code to be shown in a code-block
 */
   const code = {
    importModule: `import { PerformanceMonitorModule } from 'ngx-acuw';
  
@NgModule({ 
  declarations: [AppComponent, ...],
  imports: [PerformanceMonitorModule],
  bootstrap: [AppComponent]
})
export class AppModule { 
}`,
    directiveExample: `<div class="container">
  <div #threejsContainer class="threejs-container"></div>
</div>
<acuw-performance-monitor #performanceMonitor></acuw-performance-monitor>`,
    tsExample: `
@ViewChild('performanceMonitor') performanceMonitor!: PerformanceMonitorComponent;

private animate(): void {
  // Run animation function outside to avoid invoking change detection
  this.ngZone.runOutsideAngular(() => {
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());

    // Code to be monitored
        
    // Call end() method of the perfomance monitor
    this.performanceMonitor.end();
  });
}`,
cssVariables: `acuw-performance-monitor {
  --position: absolute;
  --color: rgb(255, 255, 255);
  --background-color: rgba(0, 0, 0, 0.8);
  --top: 5px;
  --left: 5px;
  --width: 100px;
  --padding: 5px;
  --display: flex;
  --flex-direction: column;
  --align-items: center;
  }`
}
