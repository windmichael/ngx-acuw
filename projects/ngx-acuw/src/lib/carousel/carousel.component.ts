import { animate, AnimationBuilder, AnimationPlayer, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, NgZone, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Euler, Group, Object3D, PerspectiveCamera, Quaternion, Scene } from 'three';
import { Vector3 } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { ObjectControls } from '../controls/object-controls';
import { PerformanceMonitorComponent } from '../performance-monitor/performance-monitor.component';
import { RxjsTween } from '../tween/rxjs-tween';

@Directive({
  selector: `acuw-carousel-item`,
  host: {
    'class': 'acuw-carousel-item',
  }
})
export class CarouselItem {

  htmlElement: HTMLElement;

  constructor(private el: ElementRef) {
    this.htmlElement = this.el.nativeElement;
  }
}

@Component({
  selector: 'acuw-carousel',
  template: `
    <div class="carousel-container">
      <div #threejsContainer class="threejs-container"></div>
      <!-- dots -->
      <div #indicationDots class="dots" [ngStyle]="{'visibility': showDots ? 'visible' : 'hidden'}">
        <svg *ngFor="let carouselTemplate of carouselItemTemplates; index as i" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" [ngStyle]="{'fill': activeCarouselElement===i ? activeDotColor : dotColor}"/>
            <path id="{{i}}" fill="none" stroke-linecap="round" stroke-width="20" 
            [ngStyle]="{'stroke': dotAnimationCircleColor, 'visibility': activeCarouselElement===i && autoPlay ? 'visible' : 'hidden'}"
                  d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"/>
          </svg>
      </div>
     <acuw-performance-monitor *ngIf="showPerformanceMonitor" #performanceMonitor></acuw-performance-monitor>
    </div>
    
  `,
  styleUrls: ['./carousel.component.css'],
  animations: [
    trigger('dotsAnimation', [
      transition(':enter', [
        query('svg', [
          style({ opacity: 0, transform: 'translateY(200%)' }),
          stagger(100, [
            animate('300ms ease-in', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('svg', [
          stagger(100, [
            animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(200%)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('autoPlayAnimation', [
      state('false', style({ strokeDasharray: '0,250.2' })),
      state('true', style({ strokeDasharray: '250.2,250.2' })),
      transition('false => true', animate(5000))
    ])
  ]
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() showDots = true;
  @Input() dotColor = '#fff';
  @Input() activeDotColor = '#3f51b5';
  @Input() dotAnimationCircleColor = '#fff';
  @Input() activeCarouselElement: number = 0;
  @Input() initAnimation = true;
  @Input() radius = 200;
  @Input() yPosition = 0;
  @Input() cameraFov = 65;
  @Input() cameraDistance = 600;
  @Input() autoPlay = false;
  @Input() autoPlayInterval = 5000;
  @Input() rotationDuration = 500;
  @Input() showPerformanceMonitor = false;

  @Output() activeElementChanged = new EventEmitter<number>();

  @ViewChild('threejsContainer') threejsContainer!: ElementRef;
  @ViewChild('indicationDots') dots!: ElementRef;
  @ViewChild('performanceMonitor') performanceMonitor!: PerformanceMonitorComponent;

  @ContentChildren(CarouselItem) carouselItemTemplates!: QueryList<CarouselItem>;

  private animationFrameId!: number;
  private css3dRenderer = new CSS3DRenderer();
  private scene = new Scene();
  private camera!: THREE.PerspectiveCamera;
  private objectControls!: ObjectControls;
  private carouselElements!: CSS3DObject[];
  private carouselGroup = new Group();
  private carouselObjSubsciptions: Subscription[] = new Array<Subscription>();
  private rotationSubscription: Subscription = new Subscription();
  private animation = true;
  userMove = false;
  private dotAnimationPlayer!: AnimationPlayer | null;

  constructor(private ngZone: NgZone, private animationBuilder: AnimationBuilder) { }

  ngAfterViewInit(): void {
    // Init camera
    this.camera = new PerspectiveCamera(this.cameraFov, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0.0, 0.0, this.cameraDistance);

    // Get the with and heigth of the threejs renderer
    const divWidth = this.threejsContainer.nativeElement.clientWidth;
    const divHeight = this.threejsContainer.nativeElement.clientHeight;

    // Create CSS3D Renderer
    this.css3dRenderer = new CSS3DRenderer();
    this.css3dRenderer.setSize(divWidth, divHeight);
    this.css3dRenderer.domElement.style.position = 'absolute';
    this.css3dRenderer.domElement.style.top = '0';
    this.threejsContainer.nativeElement.appendChild(this.css3dRenderer.domElement);

    // Init carousel elements
    this.initCarouselObjects();

    // Object-Controls
    this.objectControls = new ObjectControls(this.css3dRenderer.domElement, this.carouselGroup, this.threejsContainer.nativeElement);
    this.objectControls.userInteracted$.subscribe({
      next: val => {
        this.userMove = val;
        // Cancel the rotation, if running
        this.rotationSubscription.unsubscribe();
      }
    });

    // Initialize the animation of the inidcation dots
    if (this.autoPlay) {
      this.startDotAnimation(this.activeCarouselElement);
    }

    // Animate
    this.animate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['activeCarouselElement'];
    if (change && !change.firstChange && this.carouselGroup) {
      this.rotateTo(change.currentValue, true);
    }
    change = changes['radius'];
    if (change && !change.firstChange && this.carouselGroup) {
      this.updateRadius();
    }
    change = changes['cameraFov'];
    if (change && !change.firstChange && this.camera) {
      this.camera.fov = this.cameraFov;
      this.camera.updateProjectionMatrix();
    }
    change = changes['cameraDistance'];
    if (change && !change.firstChange && this.camera) {
      this.camera.position.set(0, 0, this.cameraDistance);
      this.camera.updateProjectionMatrix();
    }
    change = changes['autoPlay'];
    if (change && this.carouselGroup) {
      if (change.currentValue === true) {
        this.startDotAnimation(this.activeCarouselElement);
      } else {
        this.resetDotAnimation();
      }
    }
  }

  ngOnDestroy(): void {
    // Cancel Animation
    cancelAnimationFrame(this.animationFrameId);
    // Unsubscribe Subscriptions
    this.rotationSubscription.unsubscribe();
    // Remove threejs container from DOM
    (this.threejsContainer.nativeElement as HTMLCanvasElement).removeChild(this.css3dRenderer.domElement);
    // Clear scene
    this.scene.clear();
  }

  /**
   * Resizes the canvas and updates the texture resulution information of the images
   */
  @HostListener('window:resize') resize(): void {
    // Get width and heigh of the threejs dom element after window resize
    const divWidth = this.threejsContainer.nativeElement.clientWidth;
    const divHeight = this.threejsContainer.nativeElement.clientHeight;
    // Define aspect ratio
    this.camera.aspect = divWidth / divHeight;
    this.camera.updateProjectionMatrix();
    this.css3dRenderer.setSize(divWidth, divHeight);
  }

  /**
   * Animation
   */
  private animate(): void {
    // Only render if the animation flat is true
    if (this.animation == true) {
      this.css3dRenderer.render(this.scene, this.camera);
    }

    if (this.performanceMonitor && this.showPerformanceMonitor) {
      this.performanceMonitor.end();
    }

    this.ngZone.runOutsideAngular(() => {
      this.animationFrameId = window.requestAnimationFrame(() => this.animate());
    });
  }

  /**
   * starts the animation of the indication dots
   * @param index index number for which dot the animation should be started
   * @returns 
   */
  private startDotAnimation(index: number): void {
    if (this.dotAnimationPlayer || !this.dots) {
      // Animation is already ongoing
      return;
    }
    // Define the animation
    let autoPlayAnimation;
    if(this.showDots){
      autoPlayAnimation = this.animationBuilder.build([
        style({ strokeDasharray: '0,250.2', visibility: 'visible' }),
        animate(this.autoPlayInterval, style({ strokeDasharray: '250.2,250.2', visibility: 'hidden' }))
      ]);
    }else{
      autoPlayAnimation = this.animationBuilder.build([
        style({ strokeDasharray: '0,250.2', visibility: 'hidden' }),
        animate(this.autoPlayInterval, style({ strokeDasharray: '250.2,250.2', visibility: 'hidden' }))
      ]);
    }
    
    // Get the element for, which the animation should be applied
    const path = (this.dots.nativeElement as HTMLElement).children[index].getElementsByTagName('path')[0];
    this.dotAnimationPlayer = autoPlayAnimation.create(path);
    // Start the animation
    this.dotAnimationPlayer.play();
    // Switch to the next carousel, as soon as the animation is finished
    this.dotAnimationPlayer.onDone(() => {
      this.dotAnimationPlayer = null;
      this.next();
    });
  }

  /**
   * Resets the dot animation
   */
  private resetDotAnimation(): void {
    if (this.dotAnimationPlayer && this.dotAnimationPlayer.hasStarted()) {
      this.dotAnimationPlayer.reset();
      this.dotAnimationPlayer = null;
    }
  }

  /**
   * Initialize the carousel objects
   */
  private initCarouselObjects(animation = true): void {
    this.carouselElements = new Array<CSS3DObject>();
    for (let idx = 0; idx < this.carouselItemTemplates.length; idx++) {
      let copiedElement = (this.carouselItemTemplates.get(idx)?.htmlElement);
      if (copiedElement) {
        var object = new CSS3DObject(copiedElement);
        object.element.style.pointerEvents = 'none';
        // Add element to global variable
        this.carouselElements.push(object);
        // Create subscription for tween animation
        this.carouselObjSubsciptions.push(new Subscription());
      }
    }

    // Clear the carousel group
    this.carouselGroup.clear();

    var yOrientation = -((this.activeCarouselElement) * Math.PI * 2 / this.carouselElements.length);
    this.carouselGroup.rotation.set(0, yOrientation, 0);
    var index = 0;
    const elementsCnt = this.carouselElements.length;

    this.carouselElements.forEach(obj => {
      // Unsubscribe previously subscription
      this.carouselObjSubsciptions[index].unsubscribe();

      // Define final position
      let tweenObj = new Object3D();
      let theta = index * 2 * (Math.PI / elementsCnt);
      tweenObj.position.setFromCylindricalCoords(this.radius, theta, this.yPosition);
      let vector = new Vector3(tweenObj.position.x * 2, tweenObj.position.y, tweenObj.position.z * 2);
      tweenObj.lookAt(vector);

      // Set roattion
      obj.rotation.x = tweenObj.rotation.x;
      obj.rotation.y = tweenObj.rotation.y;
      obj.rotation.z = tweenObj.rotation.z;

      if (this.initAnimation === true && animation === true) {
        // Set random position
        obj.position.x = Math.random() * 2000 - 1000;
        obj.position.y = Math.random() * 500;
        obj.position.z = Math.random() * 500;

        // Add the objects to the portfolio group
        this.carouselGroup.add(obj);

        // Tween to final position
        this.ngZone.runOutsideAngular(() => {
          this.carouselObjSubsciptions[index] = RxjsTween.createTween(RxjsTween.easeInOutQuad, [obj.position.x, obj.position.y, obj.position.z],
            [tweenObj.position.x, tweenObj.position.y, tweenObj.position.z], 2000).subscribe({
              next: tweenPos => {
                obj.position.set(tweenPos[0], tweenPos[1], tweenPos[2]);
              }
            });
        });
      } else {
        obj.position.x = tweenObj.position.x;
        obj.position.y = tweenObj.position.y;
        obj.position.z = tweenObj.position.z;

        // Add the objects to the portfolio group
        this.carouselGroup.add(obj);
      }

      index = index + 1;
    });

    //add the group to the scene
    this.scene.add(this.carouselGroup);
  }

  /**
   * Rotate to next carousel item
   * @returns Promise with the new active element number 
   */
  next(): Promise<number> {
    let nextElement = this.activeCarouselElement >= this.carouselElements.length - 1 ? 0 : this.activeCarouselElement + 1;
    return this.rotateTo(nextElement);
  }

  /**
   * Rotate to previous carousel item#
   * @returns Promise with the new active element number
   */
  previous(): Promise<number> {
    let nextElement = this.activeCarouselElement == 0 ? this.carouselElements.length - 1 : this.activeCarouselElement - 1;
    return this.rotateTo(nextElement);
  }

  /**
   * Rotates to a sepcific carousel item
   * @param targetIndex index of the carousel item
   */
  rotateTo(targetIndex: number, skipAnimation = false): Promise<number> {
    return new Promise((resolve, reject) => {
      if (targetIndex > this.carouselElements.length - 1) {
        console.error('target index is greater than available carousel items');
        reject('target index is greater than available carousel items');
      }

      this.resetDotAnimation();

      if (targetIndex > this.activeCarouselElement) {
        // In case the current elment is the first again, reset the orientation
        if (this.activeCarouselElement == 0 && (this.carouselGroup.rotation.y != 0
          && this.carouselGroup.rotation.x == 0 && this.carouselGroup.rotation.z == 0)) {
          this.carouselGroup.rotation.set(0, 0, 0);
        }
      } else if (targetIndex == this.carouselElements.length - 1) {
        // Set position of the first element to y = -2*PI
        if (this.activeCarouselElement == 0 && (this.carouselGroup.rotation.y == 0
          && this.carouselGroup.rotation.x == 0 && this.carouselGroup.rotation.z == 0)) {
          this.carouselGroup.rotation.set(0, -2 * Math.PI, 0);
        }
      }

      const startQuaternion = this.carouselGroup.quaternion.clone();
      // Calculate the orientation of the target item
      const yOrientation = -((targetIndex) * Math.PI * 2 / this.carouselElements.length);
      let targetQuaternion = new Quaternion().setFromEuler(new Euler(0, yOrientation, 0, 'XYZ'));

      if (skipAnimation) {
        Quaternion.slerp(startQuaternion, targetQuaternion, this.carouselGroup.quaternion, 1);
        this.rotationCompleted(targetIndex);
        resolve(this.activeCarouselElement);
      } else {
        this.rotationSubscription.unsubscribe();
        // Run rotation animation outsie zgZone
        this.ngZone.runOutsideAngular(() => {
          this.rotationSubscription = RxjsTween.createTween(RxjsTween.easeInOutQuad, 0, 1, this.rotationDuration).subscribe({
            next: x => {
              Quaternion.slerp(startQuaternion, targetQuaternion, this.carouselGroup.quaternion, x);
            },
            complete: () => {
              Quaternion.slerp(startQuaternion, targetQuaternion, this.carouselGroup.quaternion, 1);
              this.ngZone.run(() => {
                this.rotationCompleted(targetIndex);
                resolve(this.activeCarouselElement);
              });
            }
          });
        });
      }
    });
  }

  /**
   * things to do when rotation is completed
   * @param targetIndex 
   */
  private rotationCompleted(targetIndex: number): void {
    this.activeCarouselElement = targetIndex;
    this.activeElementChanged.emit(this.activeCarouselElement);
    this.objectControls.resetUserInteractionFlag();
    if (this.autoPlay) {
      this.startDotAnimation(this.activeCarouselElement);
    }
  }

  /**
   * Updates and reinits the carousel items
   */
  public updateCarouselItems(): void {
    this.initCarouselObjects(false);
  }

  /**
   * Updates the radius of the carousel items
   */
  private updateRadius(): void {
    for (let idx = 0; idx < this.carouselGroup.children.length; idx++) {
      let theta = idx * 2 * (Math.PI / this.carouselGroup.children.length);
      this.carouselGroup.children[idx].position.setFromCylindricalCoords(this.radius, theta, this.yPosition);
    }
  }
}
