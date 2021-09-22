import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css'],
  animations: [
    trigger('settingsContainer', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ImageTransitionComponent implements OnInit {

  /** Properties */
  selectedTabIndex = 0;
  imageUrls = [
    'assets/image-transition/img1.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img4.jpg'
  ];
  disImgUrls = [
    'assets/image-transition/circle_bump.jpg',
    'assets/image-transition/plastic_bump.jpg',
    'assets/image-transition/mosaik_bump.jpg',
    'assets/image-transition/wave_bump.jpg',
    'assets/image-transition/wires_bump.jpg',
    'assets/image-transition/heightMap.png',
    'assets/image-transition/stripe1.png',
    'assets/image-transition/stripes.png'
  ];
  settingsOpen = false;
  selectedTransitionType = 'distortion';
  selectedImageSize = 'cover';
  selectedTransitionDuration = 1000;
  selectedAutoPlayEnabled = true;
  selectedAutoPlayInterval = 5000;
  selectedIntensity = 50.0;
  selectedSizeX = 40.0;
  selectedSizeY = 40.0;
  selectedWidth = 0.5;
  selectedDistUrl = '';
  code: any;

  /** Constructor */
  constructor(private route: ActivatedRoute,
    private router: Router, private utility: UtilityService) {
    this.code = code;
  }

  /** Angular ngOnInit */
  ngOnInit(): void {
    this.selectedDistUrl = this.disImgUrls[0];
    const activeTab = this.route.snapshot.paramMap.get('tab');
    this.selectedTabIndex = this.utility.getTabIndexFromParam(activeTab);
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
  }
}

/**
 * constant, which contains code to be shown in a code-block
 */
const code = {
  importModule: `import { ImageTransitionModule } from 'ngx-acuw';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [ImageTransitionModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}`,
  directiveExample: `<lib-image-transition 
  [imageUrls]="imageUrls" 
  transitionType="split" 
  imageSize="cover" 
  [transitionDuration]="1000">
  </lib-image-transition>`
}