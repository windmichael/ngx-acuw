import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarouselComponent } from 'projects/ngx-acuw/src/public-api';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel-demo.component.html',
  styleUrls: ['./carousel-demo.component.css'],
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
export class CarouselDemoComponent implements OnInit {

  @ViewChild(CarouselComponent) carousel!: CarouselComponent;

  /**
   * Properties
   */
  selectedTabIndex = 0;
  settingsOpen = false;
  numberOfCarouselItems = 6;
  activeCarouselItem = 0;
  carouselItems = [
    'assets/image-transition/img1.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img4.jpg',
    'assets/image-transition/img5.jpg',
    'assets/image-transition/img6.jpg',
  ];
  selectedRadius = 350;
  selectedCameraDistance = 740;
  code: any;

  /**
   * Constructor
   */
  constructor(private route: ActivatedRoute,
    private router: Router, private utility: UtilityService) {
    this.code = code;
  }

  /**
   * Angular lifecycle -> ngOnInit
   */
  ngOnInit(): void {
    const activeTab = this.route.snapshot.paramMap.get('tab');
    this.selectedTabIndex = this.utility.getTabIndexFromParam(activeTab);
    if (window.innerWidth < 600) {
      this.selectedCameraDistance = 790;
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
  }

  /**
   * Adapts the number of carousel items
   * @param value number of carousel items to be shown
   */
  numberOfItemsChanged(value: number) {
    this.carouselItems = new Array<string>(value);
    for (let idx = 0; idx < this.carouselItems.length; idx++) {
      this.carouselItems[idx] = `assets/image-transition/img${idx + 1}.jpg`;
    }
    setTimeout(() => { this.carousel.updateCarouselItems(); }, 0)
  }
}

/**
 * constant, which contains code to be shown in a code-block
 */
const code = {
  importModule: `import { CarouselModule } from 'ngx-acuw';

  @NgModule({ 
    declarations: [AppComponent, ...],
    imports: [CarouselModule],
    bootstrap: [AppComponent]
  })
  export class AppModule { 
  }`,
  directiveExample: `<acuw-carousel #carousel 
  class="carousel" 
  [(activeCarouselElement)]="activeCarouselItem" 
  radius="350" cameraDistance="740">
    <acuw-carousel-item class="carousel-item">
      <h2>Item 1</h2>
      <p>Lorem ipsum dolor sit amet, 
        consetetur sadipscing elitr, 
        sed diam nonumy eirmod tempor 
        invidunt ut labore et dolore magna 
        aliquyam erat, sed diam voluptua.
      </p>
    </acuw-carousel-item>
    <acuw-carousel-item class="carousel-item">
      <h2>Item 2</h2>
      <p>Lorem ipsum dolor sit amet, 
        consetetur sadipscing elitr, 
        sed diam nonumy eirmod tempor 
        invidunt ut labore et dolore magna 
        aliquyam erat, sed diam voluptua.
      </p>
  </acuw-carousel-item>
  <acuw-carousel-item class="carousel-item">
      <h2>Item 3</h2>
      <p>Lorem ipsum dolor sit amet, 
        consetetur sadipscing elitr, 
        sed diam nonumy eirmod tempor 
        invidunt ut labore et dolore magna 
        aliquyam erat, sed diam voluptua.
      </p>
  </acuw-carousel-item>
</acuw-carousel>`
}