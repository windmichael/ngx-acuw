import { Observable, Subject } from 'rxjs';
import * as THREE from 'three';
import { Object3D, Vector2 } from 'three';
import { RxjsTween } from '../tween/rxjs-tween';

export class ObjectControls {

    // ============= Private Properties =============
    private isUserInteracting: boolean = false;
    private restoringAnimationOngoing: boolean = false;
    private restoringOriginPosTimeout = 0;
    private startDraggingPosition: Vector2;
    private rendererDom: HTMLElement;
    private touchArea: HTMLElement;
    private obj: THREE.Mesh | THREE.Group;
    private userInteracted: boolean = false;
    private userInteractedSubject: Subject<boolean> = new Subject();

    // ============= Public Properties =============
    rotationSpeed = 1;
    verticalRotation = true;
    horizontalRotation = true;
    autoRotationY = false;
    autoRotationX = false;
    autoRotationZ = false;
    restoreOriginPosition = false;
    autoRotationSpeed = 0.002;
    userInteracted$: Observable<boolean> = this.userInteractedSubject.asObservable();
    controlsEnabled = true;

    constructor(rendererDom: HTMLElement, object: THREE.Mesh | THREE.Group, touchArea?: HTMLElement) {
        this.rendererDom = rendererDom;
        this.obj = object;
        this.touchArea = touchArea != null ? touchArea : this.rendererDom;

        this.startDraggingPosition = new Vector2(0, 0);

        this.addEventlisteners();
    }

    // ============= Public Methods =============

    /**
     * Method, which needs to be called, in case autorotation is used
     */
    update(): void {
        if (this.isUserInteracting || this.restoringAnimationOngoing || this.userInteracted) return;

        var rotationY = this.autoRotationY == true ? this.autoRotationSpeed : 0;
        var rotationX = this.autoRotationX == true ? this.autoRotationSpeed : 0;
        var rorationZ = this.autoRotationZ == true ? this.autoRotationSpeed : 0;

        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
            rotationX,
            rotationY,
            rorationZ,
            'XYZ'
        ));
        this.obj.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.obj.quaternion);
    }

    /**
     * Removes the event listners
     */
    removeEventlisteners(): void {
        // desktop events
        this.touchArea.removeEventListener('mousedown', this.mouseDown, false);
        this.touchArea.removeEventListener('mousemove', this.mouseMove, false);
        this.touchArea.removeEventListener('mouseup', this.mouseUp, false);
        // mobile events
        this.touchArea.removeEventListener('touchstart', this.onTouchStart, false);
        this.touchArea.removeEventListener('touchmove', this.onTouchMove, false);
        this.touchArea.removeEventListener('touchend', this.onTouchEnd, false);
    }

    resetUserInteractionFlag(): void {
        this.userInteracted = false,
            this.userInteractedSubject.next(this.userInteracted);
    }

    // ============= Private Methods =============

    /**
     * Adds the event listeners
     */
    private addEventlisteners(): void {
        // desktop events
        this.touchArea.addEventListener('mousedown', this.mouseDown, false);
        // mobile events
        this.touchArea.addEventListener('touchend', this.onTouchEnd, false);
        this.touchArea.addEventListener('touchstart', this.onTouchStart, false);
        this.touchArea.addEventListener('touchmove', this.onTouchMove, false);
    }

    /**
     * Reset the mouse position to x=0 and y=0
     */
    private resetMousePosition(): void {
        this.startDraggingPosition.set(0, 0);
    }

    /******************  MOUSE interaction functions - desktop  *****/
    /**
     * Prepares everything, when the mouse is clicked
     * @param e mouse event
     */
    private mouseDown = (e: MouseEvent) => {
        // Ignore mouse down interaction, if the controls are not enabled
        // Ignore mouse down interaction, if the restoration animation is ongoing
        if (this.controlsEnabled === false || this.restoringAnimationOngoing === true) return;
        // Reset restoration animation timout
        window.clearTimeout(this.restoringOriginPosTimeout);

        this.isUserInteracting = true;
        this.startDraggingPosition = new Vector2(0, 0);
        this.startDraggingPosition.set(e.offsetX, e.offsetY);

        this.touchArea.addEventListener('pointermove', this.mouseMove, false);
        this.touchArea.addEventListener('pointerup', this.mouseUp, false);
    }

    /**
     * Calculates the x and y rotation of the object depending on the mouse movement
     * @param e MouseEvent
     */
    private mouseMove = (e: MouseEvent) => {
        // Ignore mouse movement interaction, if the controls are not enabled
        // Ignore mouse movement interaction, if the restoration animation is ongoing
        if (this.controlsEnabled === false || this.restoringAnimationOngoing) return;
        if (this.isUserInteracting) {
            if (this.userInteracted == false) {
                this.userInteracted = true;
                this.userInteractedSubject.next(this.userInteracted);
            }

            const deltaMove = new Vector2(
                e.offsetX - this.startDraggingPosition.x,
                e.offsetY - this.startDraggingPosition.y
            );
            this.startDraggingPosition.set(e.offsetX, e.offsetY);

            const rotationX = this.verticalRotation == true ? (deltaMove.x * Math.PI / 180 * this.rotationSpeed) : 0;
            const rotationY = this.horizontalRotation == true ? (deltaMove.y * Math.PI / 180 * this.rotationSpeed) : 0;

            var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                rotationY,
                rotationX,
                0,
                'XYZ'
            ));

            this.obj.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.obj.quaternion);

            //console.log(`rotX: ${Math.round(THREE.MathUtils.radToDeg(this.obj.rotation.x))}, rotY: ${Math.round(THREE.MathUtils.radToDeg(this.obj.rotation.y))}, rotZ: ${Math.round(THREE.MathUtils.radToDeg(this.obj.rotation.z))}`);
        }
    }

    private mouseUp = () => {
        // Ignore mouse movement interaction, if the controls are not enabled
        // Ignore mouse up interaction, if the restoration animation is ongoing
        if (this.controlsEnabled === false || this.restoringAnimationOngoing) return;
        this.resetMousePosition();
        this.isUserInteracting = false;
        if (this.restoreOriginPosition) this.restoreOriginalPosition();

        this.touchArea.removeEventListener('mousemove', this.mouseMove, false);
        this.touchArea.removeEventListener('mouseup', this.mouseUp, false);
    }

    /****************** TOUCH interaction functions - mobile  *****/
    private onTouchStart = (e: TouchEvent) => {
        // Ignore mouse movement interaction, if the controls are not enabled
        // Ignore touch start interaction, if the restoration animation is ongoing
        if (this.controlsEnabled === false || this.restoringAnimationOngoing) return;
        // Reset restoration animation timout
        window.clearTimeout(this.restoringOriginPosTimeout);

        //e.preventDefault();
        this.isUserInteracting = true;
        this.restoringAnimationOngoing = false;
        this.startDraggingPosition.set(
            e.touches[0].pageX, e.touches[0].pageY
        )
    }

    private onTouchMove = (e: TouchEvent) => {
        // Ignore mouse movement interaction, if the controls are not enabled
        // Ignore mouse move interaction, if the restoration animation is ongoing
        if (this.controlsEnabled === false || this.restoringAnimationOngoing) return;
        //e.preventDefault();
        if (this.isUserInteracting && !this.restoringAnimationOngoing) {
            if (this.userInteracted == false) {
                this.userInteracted = true;
                this.userInteractedSubject.next(this.userInteracted);
            }

            const deltaMove = new Vector2(
                e.touches[0].pageX - this.startDraggingPosition.x,
                e.touches[0].pageY - this.startDraggingPosition.y
            );

            this.startDraggingPosition.set(e.touches[0].pageX, e.touches[0].pageY);

            const rotationX = this.verticalRotation == true ? (deltaMove.x * Math.PI / 180 * this.rotationSpeed) : 0;
            const rotationY = this.horizontalRotation == true ? (deltaMove.y * Math.PI / 180 * this.rotationSpeed) : 0;

            var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
                rotationY,
                rotationX,
                0,
                'XYZ'
            ));

            this.obj.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.obj.quaternion);
        }
    }

    private onTouchEnd = (e: TouchEvent) => {
        // Ignore mouse movement interaction, if the controls are not enabled
        // Ignore mouse up interaction, if the restoration animation is ongoing
        if (this.controlsEnabled === false || this.restoringAnimationOngoing) return;
        //e.preventDefault();
        this.isUserInteracting = false;
        this.resetMousePosition();
        if (this.restoreOriginPosition) this.restoreOriginalPosition();
    }

    /**
     * Rotates the object to the position 0,0,0 after a some timeout
     */
    private restoreOriginalPosition(): void {
        this.restoringOriginPosTimeout = window.setTimeout(() => {
            var objSet = new Object3D();
            objSet.position.set(0, 0, 0);
            objSet.rotation.set(0, 0, 0);

            RxjsTween.createTween(RxjsTween.linear, [this.obj.position.x, this.obj.position.y, this.obj.position.z],
                [objSet.position.x, objSet.position.y, objSet.position.z], 1000).subscribe({
                    next: tweenVal => {
                        if (this.restoringAnimationOngoing == false) this.restoringAnimationOngoing = true;
                        this.obj.rotation.set(tweenVal[0], tweenVal[1], tweenVal[2]);
                    },
                    complete: () => {
                        this.restoringAnimationOngoing = false;
                        this.resetUserInteractionFlag();
                    }
                });
        }, 5000);
    }
}
