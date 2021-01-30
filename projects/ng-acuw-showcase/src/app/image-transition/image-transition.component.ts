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

  selectedTabIndex = 0;
  imageUrls: string[] = [
    'assets/image-transition/img1.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img4.jpg'
  ];
  settingsOpen = false;
  selectedTransitionType = 'noise';
  selectedImageSize = 'cover';
  selectedTransitionDuration = 1000;
  selectedAutoPlayEnabled = true;
  selectedAutoPlayInterval = 5000;
  selectedIntensity = 50.0;
  selectedSizeX = 40.0;
  selectedSizeY = 40.0;
  selectedWidth = 0.5;
  importModule = `import { ImageTransitionModule } from 'ngx-acuw';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [ImageTransitionModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}`;
  directiveExample = `<lib-image-transition
    [imageUrls]="imageUrls"
    transitionType="split"
    imageSize="cover"
    [transitionDuration]="1000">
  </lib-image-transition>`;

  constructor(private route: ActivatedRoute, 
    private router: Router, private utility: UtilityService) { }

  ngOnInit(): void {
    const activeTab = this.route.snapshot.paramMap.get('tab');
    this.selectedTabIndex = this.utility.getTabIndexFromParam(activeTab);
  }

  toggleSettingsDialog(): void {
    this.settingsOpen = this.settingsOpen === true ? false : true;
  }

  formatLabelNumber(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value.toString();
  }

  selctedTabChanged(index: number){
    const param = this.utility.getParamFromTabIndex(index);
    const activeTab = this.route.snapshot.paramMap.get('tab');
    if(activeTab === null){
      this.router.navigate([param], {relativeTo: this.route});
    }else{
      this.router.navigate(['../' + param], {relativeTo: this.route});
    }
  }
}
